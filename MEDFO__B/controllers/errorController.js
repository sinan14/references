// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const DEV_MODE = Boolean(process.env.DEVELOPMENT_MODE);

  if (!DEV_MODE) {
    console.log({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

    res
      .status(err.statusCode)
      .json({ error: true, message: "Something went wrong. try again" });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};
