"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();

router.post("/shop/signup", accessController.signUp);
router.get("/test", (req, res) => {
  return res.json({ test: "test" });
});

module.exports = router;
