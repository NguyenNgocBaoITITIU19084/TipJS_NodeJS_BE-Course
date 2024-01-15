require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();
console.log("process", process.env.NODE_ENV);

// init middlewares
app.use(morgan("dev"));
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongoose");
const { countConnect, checkOverLoad } = require("./helper/check.connection");
countConnect();
checkOverLoad();

// init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "welcome Fantips" });
});

// handling errors

module.exports = app;
