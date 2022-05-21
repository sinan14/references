const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const session = require("express-session");
const morgan = require("morgan");
const passport = require("passport");

const adminRoutes = require("./routes/adminRoutes");
const medFeedRoutes = require("./routes/medFeedRoutes");
const foliofitRoutes = require("./routes/foliofitRoutes");

const userRoutes = require("./routes/userRoutes");
const adsRoutes = require("./routes/adsRoutes");
const customerRoutes = require("./routes/customerRoutes");
const healthCare = require("./routes/healthCareRoute");
const deliveryRoutes = require("./routes/deliveryRoutes");
const deliveryUserRoutes = require("./routes/deliveryUserRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const globalErrHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
app.use(passport.initialize());

// Allow Cross-Origin requests

app.use(cors());

// Set security HTTP headers
app.use(helmet());

var EventEmitter = require("events").EventEmitter;
let emitter = new EventEmitter();
emitter.setMaxListeners(100);
// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);

app.use(express.urlencoded({ extended: true }));

//multipart form data

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

//express-session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000000 },
  })
);

//log http request
app.use(morgan("dev"));

// Routes
app.use("/employee", express.static("public/images/employees"));
app.use("/master", express.static("public/images/master"));
app.use("/inventory", express.static("public/images/inventory"));
app.use("/coupon", express.static("public/images/coupon"));
app.use("/popup", express.static("public/images/popup"));

app.use("/doctor", express.static("public/images/doctor"));
app.use("/delivery", express.static("public/images/delivery"));
app.use("/users", express.static("public/images/user"));
app.use("/prescriptions", express.static("public/prescriptions"));
app.use("/order-invoice", express.static("public/order-invoices"));
app.use("/logo", express.static("helpers/PDFs/Order-Invoice/templates/assets/images"));

app.use("/admin", adminRoutes);
app.use("/medfeed", medFeedRoutes);
app.use("/foliofit", foliofitRoutes);

app.use("/healthcare", healthCare);
app.use("/user", userRoutes);
app.use("/ads", adsRoutes);
app.use("/customer", customerRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/delivery-user", deliveryUserRoutes);

app.use("/doctor", doctorRoutes);

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "fail", "undefined route");
  next(err, req, res, next);
});
app.get("/", (req, res, next) => {
  res.send("<h1>haiii medfolio</h1>");
  next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;
