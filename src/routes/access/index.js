"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/apiKey.auth");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));

router.get("/shop/login", asyncHandler(accessController.login));

// Authentication
router.use(authentication);
///////////////////////////////
router.get("/shop/logout", asyncHandler(accessController.logout));

router.get(
  "/test",
  asyncHandler((req, res) => {
    return res.json({ test: "test" });
  })
);

module.exports = router;
