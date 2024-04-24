"use strict";

// packages
const jwt = require("jsonwebtoken");

// files
const KeyService = require("../services/key.service");
const { asyncHandler } = require("../helper/asyncHandler");
const { HEADER } = require("../contants/header");
const { UnAuthorizedError, NotFoundError } = require("../core/error.response");

const createTokenPairRSA = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refeshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        return console.error("error verify token", err);
      } else {
        console.log("decode jwt::", decode);
      }
    });
    return { accessToken, refeshToken };
  } catch (error) {
    return console.log(error);
  }
};

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      expiresIn: "2 days",
    });
    const refeshToken = await jwt.sign(payload, publicKey, {
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, privateKey, (err, decode) => {
      if (err) {
        return console.error("error verify token", err);
      } else {
        console.log("decode jwt::", decode);
      }
    });
    return { accessToken, refeshToken };
  } catch (error) {
    return console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId on header is missing or not ?
    2 - query keyStore with userId
    3 - get accessToken on headers
    4 - compare accessToken with keyStore
    5 - verify token 
    6 - return OK
  */

  const userId = req.headers[HEADER.CLIEND_ID]?.toString();
  if (!userId) throw new UnAuthorizedError("Invalid request");

  const keyStore = await KeyService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) throw new UnAuthorizedError("Invalid request");

  try {
    const decodedUser = jwt.verify(accessToken, keyStore.privateKey);
    if (userId !== decodedUser.userId)
      throw new UnAuthorizedError("Invalid User");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = {
  createTokensPair,
  createTokenPairRSA,
  authentication,
};
