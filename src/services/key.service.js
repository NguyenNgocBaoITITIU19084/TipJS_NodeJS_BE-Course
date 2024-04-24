"use strict";

const keyTokenModel = require("../models/tokenkey.model");

class KeyService {
  static createKeyRSA = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
        privateKey: "123",
        refeshToken: "123",
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
  static createKey = async ({ userId, publicKey, privateKey, refeshToken }) => {
    try {
      const filter = {
        user: userId,
      };
      const update = {
        privateKey,
        publicKey,
        refeshToken,
        refeshTokensUsed: [],
      };
      const option = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyService;
