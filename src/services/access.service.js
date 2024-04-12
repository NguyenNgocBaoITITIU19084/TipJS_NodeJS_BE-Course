"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyService = require("./key.service");
const { ROLE } = require("../contants/roles.contant");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: shop already registerd");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [ROLE.SHOP],
    });
    if (newShop) {
      //created privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: { type: "pkcs1", format: "pem" },
        privateKeyEncoding: { type: "pkcs1", format: "pem" },
      });

      console.log(privateKey, publicKey);
      const publicKeyString = await KeyService.createKey({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxx",
          message: "publicKeyString error",
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log("publicKeyObject", publicKeyObject);
      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ["name"], object: newShop }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
