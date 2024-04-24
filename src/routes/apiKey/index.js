"use strict";

const express = require("express");

const { asyncHandler } = require("../../helper/asyncHandler");
const apiKeyController = require("../../controllers/apiKey.controller");

const router = express.Router();

router.post("/apiKey/create", asyncHandler(apiKeyController.createTokenKey));

module.exports = router;
