"use strict";

const express = require("express");
const router = express.Router();

const { apiKey } = require("../auth/apiKey.auth");
// check api key
router.use(apiKey);
// check permission

router.use("/api/v1", require("./access"));

module.exports = router;
