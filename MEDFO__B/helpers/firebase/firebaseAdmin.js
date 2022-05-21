const admin = require("firebase-admin");
const serviceAccount = require("./fire-base.json");
// add your firebase db url here
// const FIREBASE_DATABASE_URL;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firebaseAdmin = {};
firebaseAdmin.sendMulticastNotification = function (payload) {
  console.log("Push Notification Success");
  const message = {
    notification: {
      title: payload.title,
      image: payload.image,
      body: payload.message,
    },
    tokens: payload.tokens,
    data: {
      title: payload.product_name,
      redirectionType: payload.redirectionType,
      type: payload.type,
      redirectionId: payload.redirectionId,
    },
  };
  if (payload.image) {
    message.data.image = payload.image
  }else{
    message.data.image = ''
  }
  console.log(message);
  return admin
    .messaging()
    .sendMulticast(message)
    .then((res) => {
      console.log(res.responses);
      console.log(res);
    })
    .catch((er) => {
      console.log(er);
    });
};
module.exports = firebaseAdmin;
