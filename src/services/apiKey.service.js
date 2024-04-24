"use strict";

const crypto = require("crypto");

const apiKeyModel = require("../models/apiKey.model");

const findOne = async (key) => {
  // const newKey = await apiKeyModel.create({ key, permissions: "0000" });
  const keyObject = await apiKeyModel.findOne({ key, status: true }).lean();
  console.log("keyObject::", keyObject);
  return keyObject;
};

const createApiKey = async ({ permissions }) => {
  const generateKey = crypto.randomBytes(64).toString("hex");
  console.log("generateKey", generateKey);
  console.log("permissions", permissions);
  const apiKey = await apiKeyModel.create({ key: generateKey, permissions });
  return apiKey;
};

module.exports = {
  findOne,
  createApiKey,
};
