const MedCoinDetails = require("../../models/medcoin/medCoinDetails");

const checkIfMedCoinDetailsExistInTheDBAndAddToDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const medCoinDetails = await MedCoinDetails.findOne();

      if (!medCoinDetails) {
        await new MedCoinDetails().save();
      }

      resolve({ status: "ok" });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = checkIfMedCoinDetailsExistInTheDBAndAddToDB;
