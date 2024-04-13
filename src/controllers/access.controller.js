"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.response");

class AccessController {
  login = async (req, res, next) => {
    console.log(`[P]::login::`, req.body);
    new OK({
      message: "Success Login",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    new CREATED({
      message: "Success Sign Up",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
