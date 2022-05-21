const mongoose = require("mongoose");
const schedule = require("node-schedule");

const dotenv = require("dotenv");

const checkIfMedCoinDetailsExistInTheDBAndAddToDB = require("./data/defaultDBData/medCoinDetails");
const scheduled = require("./controllers/pushNotification/schedule");

const {
  getExpiredMedCoinAndUpdate,
} = require("./controllers/medcoin/medCoinController");

dotenv.config({
  path: "./config.env",
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err);
  process.exit(1);
});

const app = require("./app");

const database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Connect the database

mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (con) => {
    await checkIfMedCoinDetailsExistInTheDBAndAddToDB();
    await getExpiredMedCoinAndUpdate();
    //this cron will wor every day morning and to expired med coins
    schedule.scheduleJob(
      { hour: 00, minute: 00, second: 0, tz: process.env.TIME_ZONE },
      async () => {
        await getExpiredMedCoinAndUpdate();
      }
    );
    scheduled.reSchedule();
    console.log("DB connection Successfully!");
  });

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
