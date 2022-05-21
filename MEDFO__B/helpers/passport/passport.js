const passport = require("passport");
const facebookTokenStrategy = require("passport-facebook-token");
const User = require("../../models/user");

module.exports = function () {
  passport.use(
    "facebook",
    new facebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          console.log(profile);
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (existingUser) {
            return cb(null, existingUser);
          }

          // -- logic for adding customerId
          // finding all users having customerId
          let allUsers = await User.find({ customerId: { $exists: true } });

          let newCustomerId = "";

          var dateVar = new Date();
          let lastTwoDigitsOfYear = dateVar.getFullYear().toString().substr(-2);
          let twoDigitMonth = ("0" + (dateVar.getMonth() + 1)).slice(-2);

          if (allUsers.length) {
            let lastUserId = allUsers[allUsers.length - 1].customerId;

            // splitted with spaces
            let splittedCustomerId = lastUserId.split(" ");

            let newCount =
              parseInt(splittedCustomerId[splittedCustomerId.length - 1]) + 1;

            newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} ${newCount}`;
            console.log("newCustomerId", newCustomerId);
          } else {
            newCustomerId = `UIN MDFL ${lastTwoDigitsOfYear} ${twoDigitMonth} 12000`;
          }

          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            customerId: newCustomerId,
          });

          await newUser.save();
          cb(null, newUser);
        } catch (error) {
          console.log(error);
          cb(error, false);
        }
      }
    )
  );
};
