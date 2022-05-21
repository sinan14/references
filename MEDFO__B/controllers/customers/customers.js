const Users = require("../../models/user");
const {
  validateGetCustomersBySegment,
} = require("../../validations/customers/customersValidation");

const getCustomersBySegment = async (req, res, next) => {
  try {
    //validate incoming data
    const dataValidation = await validateGetCustomersBySegment(req.body);
    if (dataValidation.error) {
      const message = dataValidation.error.details[0].message.replace(/"/g, "");
      return res.status(400).json({
        error: true,
        message: message,
      });
    }

    let { segment, name, page, selectAll } = req.body;

    if (segment !== "all_customers") {
      return res.json({
        error: false,
        message: "Customers are empty.",
        data: { customers: [] },
      });
    }

    page = page * 100;

    //TODO: categorize users by segment

    const customers = await Users.find(
      {
        active: true,
        ...(name && {
          $or: [
            { name: { $regex: `${name}`, $options: "i" } },
            { phone: { $regex: `${name}`, $options: "i" } },
          ],
        }),
      },
      { name: 1, phone: 1 }
    )
      .sort({ name: 1 })
      .limit(!selectAll ? 100 : 0)
      .skip(!selectAll ? page : 0);

    return res.json({
      error: false,
      message: customers?.length ? "Customers found." : "Customers are empty.",
      data: { customers },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomersBySegment };
