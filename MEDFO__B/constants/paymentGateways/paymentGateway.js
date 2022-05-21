const Razorpay = require("razorpay");
const { Payouts } = require("@cashfreepayments/cashfree-sdk");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Instantiate Cash free Payouts
const payoutsInstance = new Payouts({
  env: process.env.CASHFREE_ENV,
  clientId: process.env.CASHFREE_CLIENT_ID,
  clientSecret: process.env.CASHFREE_CLEINT_SECRET,
});

module.exports = { razorpay, payoutsInstance };
