const mongoose = require("mongoose");

const pushNotificationSchema = mongoose.Schema({
  segment: {
    type: String,
  },
  fcmIds: {
    type: Array,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  image: {
    type: String,
  },
  redirectionType: {
    type: String,
  },
  type: {
    type: String,
  },
  userIds: {
    type: Array,
  },
  redirectionId: {
    type: String,
  },
  immediate: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false },
});
pushNotificationSchema.pre("save", function (next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  this.updatedAt = now.getTime();
  next();
});

const pushNotification = mongoose.model(
  "pushNotification",
  pushNotificationSchema
);
module.exports = pushNotification;
