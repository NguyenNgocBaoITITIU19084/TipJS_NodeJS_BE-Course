"use strict";

const jwt = require("jsonwebtoken");

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

module.exports = {
  createTokensPair,
  createTokenPairRSA,
};
