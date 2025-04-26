// routes/razorpayRoutes.js
const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../Controllers/razorpayController");

router.post("/create-razorpay-order", createRazorpayOrder);

module.exports = router;
