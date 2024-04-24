"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const { ROLE } = require("../contants/roles.contant");
const { createTokenPairRSA, createTokensPair } = require("../auth/authUtils");
const { getInfoData, generateKeyPair } = require("../utils/index");
const {
  BadRequestError,
  UnAuthorizedError,
} = require("../core/error.response");

// Services
const KeyService = require("./key.service");
const { findByEmail } = require("../services/shop.service");

class AccessService {
  static logout = async (keyObject) => {
    console.log("keyObject", keyObject);
    const removeKey = await KeyService.removeByUserId(keyObject.user);
    return removeKey;
  };

  static login = async ({ email, password, refeshToken = null }) => {
    /*
    Flow of Login Function:
      1 - checking email in db 
      2 - matching password
      3 - create AT , RT
      4 - return data
  */
    const foundedShop = await findByEmail({ email });
    if (!foundedShop) throw new BadRequestError("Shop is not registed");

    const matchedPassword = bcrypt.compareSync(password, foundedShop.password);
    if (!matchedPassword) throw new UnAuthorizedError("Authorized Error");

    const { publicKey, privateKey } = generateKeyPair();
    console.log({ publicKey, privateKey });

    const tokens = await createTokensPair(
      { userId: foundedShop._id },
      publicKey,
      privateKey
    );
    await KeyService.createKey({
      userId: foundedShop._id,
      publicKey,
      privateKey,
      refeshToken: tokens.refeshToken,
    });
    console.log(tokens);
    return {
      shop: getInfoData({ fields: ["name", "email"], object: foundedShop }),
      tokens,
    };
  };

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
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: { type: "pkcs1", format: "pem" },
      //   privateKeyEncoding: { type: "pkcs1", format: "pem" },
      // });

      // console.log(privateKey, publicKey);
      // const publicKeyString = await KeyService.createKeyRSA({
      //   userId: newShop._id,
      //   publicKey,
      // });

      // console.log("publicKeyString", publicKeyString);

      // if (!publicKeyString) {
      //   return {
      //     code: "xxx",
      //     message: "publicKeyString error",
      //   };
      // }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log("publicKeyObject", publicKeyObject);
      // //create token pair
      // const tokens = await createTokenPairRSA(
      //   { userId: newShop._id, email },
      //   publicKeyObject,
      //   privateKey
      // );

      //====================================================================
      // generate pub and private key
      const { publicKey, privateKey } = generateKeyPair();

      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);

      const publicKeyString = await KeyService.createKey({
        userId: newShop._id,
        publicKey,
        privateKey,
        refeshToken: tokens.refeshToken,
      });

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
