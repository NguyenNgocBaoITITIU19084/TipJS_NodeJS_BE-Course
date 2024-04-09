"use strict";

const apiKeyModel = require("../models/apiKey.model");

const findOne = async (key) => {
  //   const newKey = await apiKeyModel.create({ key, permissions: "0000" });
  const keyObject = await apiKeyModel.findOne({ key, status: true }).lean();
  console.log("keyObject::", keyObject);
  return keyObject;
};

module.exports = {
  findOne,
};
