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

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.keyObject.permissions) {
      return res.status(403).json({ message: "permission dinied" });
    }
    const validPermission = req.keyObject.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: "permission dinied" });
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
