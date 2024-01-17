"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyService = require("./key.service");
const { ROLE } = require("../contants/roles.contant");
const { createTokenPair } = require("../auth/authUtils");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
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
            shop: newShop,
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
