const express = require('express');
const router = express.Router();
const controller = require('../controllers/stripe.controller.js');
const authMiddleware = require('../middlewares/auth.js');

// Create a payment intent for checkout
router.post('/create-payment-intent', authMiddleware, controller.createPaymentIntent);

// Confirm a payment
router.post('/pay', authMiddleware, controller.pay);

module.exports = router; 