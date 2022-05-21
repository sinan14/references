const mongoose = require("mongoose");
const moment = require("moment-timezone");
const _ = require("lodash");

const MedCoin = require("../../models/medcoin/medCoin");
const Users = require("../../models/user");
const MedCoinAd1Ad2HowItWorks = require("../../models/ads/medcoin/medCoinAd1Ad2HowItWorks");
const MedCoinDetails = require("../../models/medcoin/medCoinDetails");
const {
  validateRechargeAndWithdrawMedCoin,
  validatePayMedCoin,
  validateWithdrawMedCoinFromUser,
  validateGetMedCoinStatements,
  validateGetMedCoinDetailsByUser,
} = require("../../validations/medcoin/medCoinValidations");

const rechargeMedCoin = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateRechargeAndWithdrawMedCoin(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    req.body.type = "recharge";
    const type = req.body.type;
    const { medCoinCount } = req.body;
    //get current balance admin

    const { balance } =
      (await getBalanceOFAdminAndUserMedCoin(type, parseInt(medCoinCount))) ||
      {};
    req.body.balance = parseInt(balance);

    await new MedCoin(req.body).save();

    await incrementOrDecrementAdminMedCoinBalance("inc", medCoinCount);

    return res.json({
      error: false,
      message: "Med coin recharged successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const withdrawMedCoin = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateRechargeAndWithdrawMedCoin(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    //check if available med coin balance is greater than  withdraw coin count
    const { medCoinCount } = req.body;
    const { availableBalance } = (await doGetMedCoinDetails()) || {};
    if (medCoinCount > availableBalance) {
      return res.status(200).json({
        error: true,
        message: `You cannot withdraw more than ${availableBalance}. `,
      });
    }

    req.body.type = "withdraw";
    const type = req.body.type;

    //get current balance admin

    const { balance } =
      (await getBalanceOFAdminAndUserMedCoin(type, parseInt(medCoinCount))) ||
      {};
    req.body.balance = parseInt(balance);

    await new MedCoin(req.body).save();

    await incrementOrDecrementAdminMedCoinBalance("dec", medCoinCount);

    return res.json({
      error: false,
      message: "Med coin withdrawn successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const payMedCoin = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validatePayMedCoin(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { medCoinCount, narration, customers, expiryDate } = req.body;
    let type = "pay";

    //set expiry date time to 11:59 pm

    expiryDate = moment(expiryDate)
      .tz(process.env.TIME_ZONE)
      .set({ h: 23, m: 59, s: 59 })
      .utc();

    //check expiry date is not a previous day
    if (new Date(expiryDate).getTime() < new Date().getTime()) {
      return res.status(200).json({
        error: true,
        message: "Your cannot set previous day as expiry date.",
      });
    }

    //check if all users is valid

    const queryToCheckUsers = customers.map((userId) => {
      return { _id: mongoose.Types.ObjectId(userId) };
    });

    const availableUsersCount = await Users.find({
      $or: queryToCheckUsers,
      active: true,
    }).countDocuments();

    if (availableUsersCount !== customers.length) {
      return res.json({
        error: true,
        message: "Invalid customer.",
      });
    }

    //check if available med coin balance is greater than paying coin count
    const totalMedCoinPayAmount = medCoinCount * customers.length;
    const { availableBalance } = (await doGetMedCoinDetails()) || {};

    if (!availableBalance) {
      return res.status(200).json({
        error: true,
        message: "Your med coin balance is zero.",
      });
    }

    if (totalMedCoinPayAmount > availableBalance) {
      return res.status(200).json({
        error: true,
        message: `You cannot pay more than ${Math.floor(
          availableBalance / customers.length
        )}.`,
      });
    }

    const { balance, userIdsAndBalances } =
      (await getBalanceOFAdminAndUserMedCoin(
        type,
        parseInt(medCoinCount),
        customers
      )) || {};

    await incrementOrDecrementAdminMedCoinBalance(
      "dec",
      medCoinCount * customers.length
    );

    //save pay log

    //create payment statements for each user
    const statements = userIdsAndBalances.map((user) => {
      return {
        ...(narration && { narration }),
        medCoinCount,
        customerId: user._id,
        expiryDate,
        type,
        balance: user.adminBalance,
        customerBalance: user.balance,
      };
    });

    await MedCoin.insertMany(statements);

    //increment users med coin count
    await Users.updateMany(
      { $or: queryToCheckUsers, active: true },
      {
        $inc: { medCoin: medCoinCount },
      }
    );

    return res.json({ error: false, message: "Med coin pay is successful." });
  } catch (error) {
    next(error);
  }
};

const withdrawMedCoinFromUser = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateWithdrawMedCoinFromUser(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const { medCoinCount, narration, customerId } = req.body;

    //check user is valid
    const user = await Users.findOne(
      { _id: customerId, active: true },
      { medCoin: 1 }
    );

    if (!user) {
      return res.json({
        error: true,
        message: "Invalid customer.",
      });
    }

    if (!user.medCoin) {
      return res.status(200).json({
        error: true,
        message: `This user does not have any med coin to withdraw.`,
      });
    }

    if (medCoinCount > user.medCoin) {
      return res.status(200).json({
        error: true,
        message: `You can only withdraw ${user.medCoin} med coin from this user.`,
      });
    }

    const type = "redeem";

    let { balance, userIdsAndBalances } =
      (await getBalanceOFAdminAndUserMedCoin(type, parseInt(medCoinCount), [
        customerId,
      ])) || {};

    await incrementOrDecrementAdminMedCoinBalance(
      "inc",
      parseInt(medCoinCount)
    );

    //decrement total med coin used

    await MedCoinDetails.updateOne(
      {},
      {
        $inc: {
          medCoinUsed: -parseInt(medCoinCount),
        },
      }
    );

    //save withdrawn log

    await await new MedCoin({
      ...(narration && { narration }),
      medCoinCount,
      customerId,
      type,
      balance: parseInt(balance),
      customerBalance: userIdsAndBalances[0]?.balance,
    }).save();

    //decrement users med coin count
    await Users.updateOne(
      { _id: customerId, active: true },
      {
        $inc: { medCoin: -medCoinCount },
      }
    );

    //get user all admin paid med coin and increased withdrawn amount

    const userAdminPaidCoins = await MedCoin.find({
      customerId,
      expired: false,
      expiryDate: {
        $gte: new Date(moment().tz(process.env.TIME_ZONE).utc()),
      },
    }).lean();

    if (!userAdminPaidCoins) userAdminPaidCoins = [];

    let medCoinCountDecrement = medCoinCount;

    for (const userAdminPaidCoin of userAdminPaidCoins) {
      let redeemedCoin = 0;
      if (!userAdminPaidCoin.redeemed) userAdminPaidCoin.redeemed = 0;
      if (!userAdminPaidCoin.userUsed) userAdminPaidCoin.userUsed = 0;

      if (
        userAdminPaidCoin.medCoinCount -
          userAdminPaidCoin.redeemed -
          userAdminPaidCoin.userUsed >=
        medCoinCountDecrement
      ) {
        redeemedCoin = medCoinCountDecrement;
        medCoinCountDecrement = 0;
      } else {
        redeemedCoin =
          userAdminPaidCoin.medCoinCount -
          userAdminPaidCoin.redeemed -
          userAdminPaidCoin.userUsed;
        medCoinCountDecrement -= redeemedCoin;
      }

      await MedCoin.updateOne(
        { _id: userAdminPaidCoin._id },
        {
          $inc: { redeemed: redeemedCoin },
        }
      );

      if (medCoinCountDecrement === 0) {
        break;
      }
    }

    return res.json({
      error: false,
      message: "Med coin withdrawn from customer successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getMedCoinDetails = async (req, res, next) => {
  try {
    await doGetMedCoinDetails().then((data) => {
      return res.json({
        error: false,
        message: "Med coin details found.",
        data,
      });
    });
  } catch (error) {
    next(error);
  }
};

doGetMedCoinDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let medCoinDetails = await MedCoinDetails.findOne(
        {},
        { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }
      );

      if (!medCoinDetails) {
        medCoinDetails = {
          availableBalance: 0,
          medCoinUsed: 0,
          nearToExpiry: 0,
        };
      }

      //get near to expiry coins

      let nearToExpiryDate = moment()
        .tz(process.env.TIME_ZONE)
        .set({ h: 23, m: 59, s: 59 })
        .add(7, "days");

      const nearToExpiryDocuments = await MedCoin.find({
        type: "pay",
        expired: false,
        $and: [
          {
            expiryDate: { $gte: new Date(moment().tz(process.env.TIME_ZONE)) },
          },
          {
            expiryDate: { $lte: new Date(nearToExpiryDate) },
          },
        ],
      });

      if (nearToExpiryDocuments.length) {
        nearToExpiryDocuments.forEach((doc) => {
          medCoinDetails.nearToExpiry += doc.medCoinCount;
        });
      }

      //decrement all med coin redeemed from near to expiry
      const nearToExpiryRedeemed = await MedCoin.find({
        type: "redeem",
        expired: false,

        createdAt: {
          $gte: new Date(
            moment().tz(process.env.TIME_ZONE).subtract(7, "days")
          ),
        },
      });

      if (nearToExpiryRedeemed.length) {
        nearToExpiryRedeemed.forEach((doc) => {
          medCoinDetails.nearToExpiry -= doc.medCoinCount;
        });
      }

      return resolve(medCoinDetails);
    } catch (error) {
      reject(error);
    }
  });
};

const getMedCoinStatements = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetMedCoinStatements(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    let { statementType, from, to, page, searchBy } = req.body;

    if (from) {
      from = new Date(
        moment(from)
          .tz(process.env.TIME_ZONE)
          .set({ h: 00, m: 00, s: 00 })
          .utc()
      );
    }

    if (to) {
      to = new Date(
        moment(to).tz(process.env.TIME_ZONE).set({ h: 23, m: 59, s: 59 }).utc()
      );
    }

    const pageDetails = {
      currentPage: page,
    };
    page = page - 1;
    page = page * 10;

    let queryForSearch = [{ type: { $regex: `${searchBy}`, $options: "i" } }];

    //search for admin statements
    if (parseInt(searchBy)) {
      queryForSearch.push({
        medCoinCount: parseInt(searchBy),
      });
    }

    if ("admin".includes(searchBy)) {
      queryForSearch.push({ customerId: null });
    }

    if (searchBy) {
      let users = await Users.find({
        $or: [
          { name: { $regex: `${searchBy}`, $options: "i" } },
          { customerId: { $regex: `${searchBy}`, $options: "i" } },
        ],
      });

      if (users.length) {
        users.map((user) =>
          queryForSearch.push({
            customerId: mongoose.Types.ObjectId(user._id),
          })
        );
      }
    }

    //build query based on statement type and from and to date

    //get count of total statements in the db
    const statementsCount = await MedCoin.countDocuments();

    pageDetails.totalPages = Math.ceil(statementsCount / 10);
    pageDetails.hasPrevPage =
      pageDetails.currentPage === 1 &&
      pageDetails.totalPages > pageDetails.currentPage
        ? false
        : true;
    pageDetails.hasNextPage =
      pageDetails.totalPages > pageDetails.currentPage ? true : false;
    pageDetails.totalStatements = statementsCount;

    let statements = await MedCoin.aggregate([
      { $sort: { _id: -1 } },
      {
        $match: {
          ...(from && to
            ? {
                $and: [
                  {
                    createdAt: {
                      $gte: new Date(
                        moment(from)
                          .tz(process.env.TIME_ZONE)
                          .set({ h: 00, m: 00, s: 00 })
                          .utc()
                      ),
                    },
                  },
                  {
                    createdAt: {
                      $lte: new Date(
                        moment(to)
                          .tz(process.env.TIME_ZONE)
                          .set({ h: 23, m: 59, s: 59 })
                          .utc()
                      ),
                    },
                  },
                ],
              }
            : from
            ? {
                createdAt: {
                  $gte: new Date(
                    moment(from)
                      .tz(process.env.TIME_ZONE)
                      .set({ h: 00, m: 00, s: 00 })
                      .utc()
                  ),
                },
              }
            : to
            ? {
                createdAt: {
                  $lte: new Date(
                    moment(to)
                      .tz(process.env.TIME_ZONE)
                      .set({ h: 23, m: 59, s: 59 })
                      .utc()
                  ),
                },
              }
            : {}),

          ...(statementType === "customer_wise_statement"
            ? {
                $or: [
                  { type: "pay" },
                  { type: "redeem" },
                  { type: "refer and earn" },
                  { type: "expired" },
                  { type: "refund" },
                  { type: "quiz" },
                  { type: "order" },
                ],
              }
            : {}),

          ...(searchBy && {
            $or: queryForSearch,
          }),
        },
      },
      {
        $skip: page,
      },
      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          date: "$createdAt",
          medCoinCount: 1,
          balance: 1,
          type: 1,
          customerId: "$user._id",
          name: "$user.name",
          customerBalance: 1,
          narration: 1,
          customerIdString: "$user.customerId",
        },
      },
    ]);

    statements.map((statement) => {
      if (statementType === "med_coin_statements") {
        if (!statement.name) statement.name = "admin";
        if (
          statement.type === "recharge" ||
          statement.type === "redeem" ||
          statement.type === "expired"
        ) {
          statement.credit = statement.medCoinCount;
          statement.debit = 0;
        } else if (
          statement.type === "withdraw" ||
          statement.type === "pay" ||
          statement.type === "refer and earn" ||
          statement.type === "refund" ||
          statement.type === "quiz"
        ) {
          statement.credit = 0;
          statement.debit = statement.medCoinCount;
        }
      } else if (statementType === "customer_wise_statement") {
        if (
          statement.type === "pay" ||
          statement.type === "refer and earn" ||
          statement.type === "refund" ||
          statement.type === "quiz"
        ) {
          statement.credit = statement.medCoinCount;
          statement.debit = 0;
        } else if (
          statement.type === "redeem" ||
          statement.type === "expired" ||
          statement.type === "order"
        ) {
          statement.credit = 0;
          statement.debit = statement.medCoinCount;
        }
      }

      statement.time = moment(statement.date)
        .tz(process.env.TIME_ZONE)
        .format("hh:mm:ss a");
      statement.date = moment(statement.date)
        .tz(process.env.TIME_ZONE)
        .format("DD MMM YYYY");
    });

    if (statementType === "med_coin_statements") {
      _.remove(statements, {
        type: "order",
      });
    }

    return res.json({
      error: false,
      message: "Statements found",
      data: { statements, pageDetails },
    });
  } catch (error) {
    next(error);
  }
};

//user

const getMedCoinDetailsByUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    let { page } = req.params || {};

    page = page;

    if (!page) page = 0;
    //validate incoming data
    const dataValidation = await validateGetMedCoinDetailsByUser({ page });
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(200).json({
        error: true,
        message: message,
      });
    }

    const medCoinAds = await MedCoinAd1Ad2HowItWorks.find(
      {
        isDisabled: false,
      },
      { image: 1, type: 1, _id: 0 }
    );

    if (!medCoinAds.length)
      return res.json({
        error: true,
        message: "Something went wrong try again later.",
      });

    const ads = medCoinAds;

    const transactionHistory = await MedCoin.find(
      {
        customerId: mongoose.Types.ObjectId(userId),
      },
      { customerId: 0, updatedAt: 0, __v: 0, _id: 0, balance: 0 }
    )
      .sort({ _id: -1 })
      .lean();

    let limit = transactionHistory?.length ? transactionHistory?.length : 0;

    let { medCoin: userMedCoinBalance } =
      (await Users.findOne({ _id: userId }, { medCoin: 1, _id: 0 })) || {};

    if (!userMedCoinBalance) userMedCoinBalance = 0;

    transactionHistory.map((history) => {
      if (
        history.type === "pay" ||
        history.type === "refer and earn" ||
        history.type === "refund" ||
        history.type === "quiz" ||
        history.type === "return order"
      ) {
        history.credit = history.medCoinCount?
        `+${history.medCoinCount.toFixed(2)}`:
        "+0.00";
        history.debit = "0";
      } else if (
        history.type === "redeem" ||
        history.type === "expired" ||
        history.type === "order"
      ) {
        history.credit = "0";
        history.debit = history.medCoinCount?
        `-${history.medCoinCount.toFixed(2)}`:
        "-0.00";
      }

      const date = history.createdAt;
      history.time = moment(date).tz(process.env.TIME_ZONE).format("hh:mm a");
      history.date = moment(date).format("DD-MM-YYYY");
      delete history.createdAt;

      //rename type
      if (history.type === "pay") history.type = "promotion";

      if (history.expiryDate) {
        history.expiryDate = moment(history.expiryDate)
          .tz(process.env.TIME_ZONE)
          .format("DD-MM-YYYY");
      } else {
        history.expiryDate = "";
      }

      history.customerBalance = history.customerBalance.toFixed(2);
    });

    //get total count of documents and check if it has next page

    const transactionHistoryCount = await MedCoin.countDocuments({
      customerId: mongoose.Types.ObjectId(userId),
    });

    let totalPages = Math.ceil(transactionHistoryCount / limit);
    let hasNextPage = true;
    if (page + 1 >= totalPages) {
      hasNextPage = false;
    }

    let data = {
      transactionHistory,
      totalBalance: userMedCoinBalance.toFixed(2),
      totalPages,
      hasNextPage,
    };

    ads.map((ad) => {
      ad.image = process.env.BASE_URL.concat(ad.image);
      data[ad.type] = ad.image;
    });

    return res.json({
      error: false,
      message: "Med coin details",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getBalanceOFAdminAndUserMedCoin = (type, medCoinCount, customerIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      //if type recharge or withdraw statements is only for admin so just calculate admin balance

      let { availableBalance: balance } = (await doGetMedCoinDetails()) || {};
      if (!balance) balance = 0;

      //only for pay
      let userIdsAndBalances;

      if (type === "recharge" || type === "withdraw") {
        if (type === "recharge") {
          balance += medCoinCount;
        } else {
          balance -= medCoinCount;
        }
      } else if (type === "pay" || type === "redeem" || type === "expired") {
        if (type === "pay") {
          //increment user balance

          userIdsAndBalances = await getUserBalanceById(
            customerIds,
            "inc",
            medCoinCount
          );

          let adminBalance = balance;
          //decrement admin balance for each document
          userIdsAndBalances.map((idAndBalance) => {
            adminBalance -= medCoinCount;
            idAndBalance.adminBalance = adminBalance;
          });

          balance = medCoinCount * customerIds.length;
        } else if (type === "redeem") {
          //increment admin balance
          balance += medCoinCount;
          // decrement user balance
          userIdsAndBalances = await getUserBalanceById(
            customerIds,
            "dec",
            medCoinCount
          );
        } else if (type === "expired") {
          //decrement user balance

          userIdsAndBalances = await getUserBalanceById(
            customerIds,
            "dec",
            medCoinCount
          );

          let adminBalance = balance;
          //increment admin balance for each document
          userIdsAndBalances.map((idAndBalance) => {
            adminBalance += medCoinCount;
            idAndBalance.adminBalance = adminBalance;
            idAndBalance.medCoinCount = medCoinCount;
          });

          balance = medCoinCount * customerIds.length;
        }
      }

      if (!userIdsAndBalances) userIdsAndBalances = [];

      return resolve({ balance, userIdsAndBalances });
    } catch (error) {
      reject(error);
    }
  });
};

const incrementOrDecrementAdminMedCoinBalance = (type, medCoinCount) => {
  return new Promise(async (resolve, reject) => {
    try {
      await MedCoinDetails.updateOne(
        {},
        {
          $inc: {
            availableBalance: type === "inc" ? medCoinCount : -medCoinCount,
            ...(type === "dec" && { medCoinUsed: medCoinCount }),
          },
        }
      );

      resolve({ status: "ok" });
    } catch (error) {
      reject(error);
    }
  });
};

const getUserBalanceById = (customerIds, type, medCoinCount) => {
  return new Promise(async (resolve, reject) => {
    try {
      medCoinCount = parseInt(medCoinCount);

      if (!customerIds.length || !type || !medCoinCount) {
        return reject({
          error: true,
          message: "customer Ids or type or med coin count is missing ",
        });
      }

      const queryToCheckUsers = customerIds.map((userId) => {
        return { _id: mongoose.Types.ObjectId(userId) };
      });

      const userIdsAndBalances = await Users.aggregate([
        {
          $match: {
            $or: queryToCheckUsers,
          },
        },
        {
          $project: {
            _id: 1,
            medCoin: { $ifNull: ["$medCoin", 0] },
          },
        },
        {
          $project: {
            balance:
              type === "inc"
                ? { $add: ["$medCoin", medCoinCount] }
                : { $subtract: ["$medCoin", medCoinCount] },
            medCoinCount,
          },
        },
      ]);

      return resolve(userIdsAndBalances);
    } catch (error) {
      return reject(error);
    }
  });
};

const getExpiredMedCoinAndUpdate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      expiredMedCoins = await MedCoin.find(
        {
          expired: false,
          expiryDate: {
            $lte: new Date(moment().tz(process.env.TIME_ZONE).utc()),
          },
        },
        { medCoinCount: 1, customerId: 1, redeemed: 1 }
      ).lean();

      if (!expiredMedCoins.length)
        return resolve({
          status: true,
          message: "No expired med coins found.",
        });

      const type = "expired";

      //remove from expiredCoupons if redeemed and userUsed is equal to total med coin count paid so there is nothing to expire user used all or admin withdrawn from user
      expiredMedCoins = expiredMedCoins.filter((coin) => {
        if (!coin.redeemed) coin.redeemed = 0;
        if (!coin.userUsed) coin.userUsed = 0;
        coin.medCoinCount = coin.medCoinCount - coin.redeemed - coin.userUsed;
        if (coin.medCoinCount > 0) {
          return coin;
        }
      });

      if (!expiredMedCoins.length)
        return resolve({
          status: true,
          message: "No expired med coins found.",
        });

      //group expired coins based on medCoin count

      const groupedCoinsByCoinCount = _.values(
        _.groupBy(expiredMedCoins, (coin) => coin.medCoinCount)
      );

      let userIdsAndBalancesArray = [];

      for (const groupedCoins of groupedCoinsByCoinCount) {
        const customers = groupedCoins.map((user) => user.customerId);
        const medCoinCount = groupedCoins[0]?.medCoinCount;

        let { balance, userIdsAndBalances } =
          (await getBalanceOFAdminAndUserMedCoin(
            type,
            parseInt(medCoinCount),
            customers
          )) || {};

        //update admin balance

        await incrementOrDecrementAdminMedCoinBalance("inc", parseInt(balance));

        //update user balance by decrementing med coin count that is expired

        for (const userIdAndBalance of userIdsAndBalances) {
          await Users.updateOne(
            { _id: userIdAndBalance._id },
            {
              $inc: {
                medCoin: -medCoinCount,
              },
            }
          );
        }

        userIdsAndBalancesArray =
          userIdsAndBalancesArray.concat(userIdsAndBalances);
      }

      //create expired statements for each user
      const statements = userIdsAndBalancesArray.map((user) => {
        return {
          medCoinCount: user.medCoinCount,
          customerId: user._id,
          type,
          balance: user.adminBalance,
          customerBalance: user.balance,
        };
      });

      await MedCoin.insertMany(statements);

      //set all expired med  coin statement status to expired

      const updateExpiredQuery = expiredMedCoins.map((expiredCoin) => {
        return {
          _id: mongoose.Types.ObjectId(expiredCoin._id),
        };
      });

      await MedCoin.updateMany(
        { $or: updateExpiredQuery },
        {
          expired: true,
        }
      );

      //update expired to true so it does not get added to the statements again
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  rechargeMedCoin,
  withdrawMedCoin,
  payMedCoin,
  getMedCoinDetails,
  withdrawMedCoinFromUser,
  getMedCoinStatements,
  getMedCoinDetailsByUser,
  getExpiredMedCoinAndUpdate,
  incrementOrDecrementAdminMedCoinBalance,
  doGetMedCoinDetails,
};
