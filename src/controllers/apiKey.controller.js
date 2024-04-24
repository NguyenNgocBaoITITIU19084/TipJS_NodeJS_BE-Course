"use strict";

const { createApiKey } = require("../services/apiKey.service");

const { OK, CREATED } = require("../core/success.response");

class TokenKeyController {
  createTokenKey = async (req, res, next) => {
    console.log(`[P]::createTokenKey::`, req.body);
    new CREATED({
      message: "Success Sign Up",
      metadata: await createApiKey(req.body),
    }).send(res);
  };
}

module.exports = new TokenKeyController();
