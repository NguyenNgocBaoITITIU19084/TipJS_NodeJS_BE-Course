"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/apiKey.auth");

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.get("/shop/login", asyncHandler(accessController.login));

router.get(
  "/test",
  asyncHandler((req, res) => {
    return res.json({ test: "test" });
  })
);

module.exports = router;
