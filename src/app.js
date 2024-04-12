require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middlewares
app.use(morgan("dev"));
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.unsubscribe(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongoose");
const { countConnect, checkOverLoad } = require("./helper/check.connection");
// countConnect();
// checkOverLoad();

// init routes
app.use("/", require("./routes/index"));

// handling errors
// checking not found router
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//handler error
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
