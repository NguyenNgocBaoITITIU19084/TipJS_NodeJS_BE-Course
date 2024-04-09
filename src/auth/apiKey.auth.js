"use strict";

const { findOne } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.json({ message: "Forbidden" });
    }
    const keyObject = await findOne(key);
    if (!keyObject) {
      return res.json({ message: "Forbidden" });
    }

    console.log("key::", keyObject);
    req.keyObject = keyObject;
    return next();
  } catch (error) {}
};

module.exports = {
  apiKey,
};
