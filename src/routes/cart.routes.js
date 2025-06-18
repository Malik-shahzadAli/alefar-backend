const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller.js');
const authMiddleware = require('../middlewares/auth.js')
router.post('/add', authMiddleware,controller.addToCart );
router.get('/remove/:productId', authMiddleware, controller.deleteProductFromCart)
router.post('/update/:productId', authMiddleware, controller.updateProductQuantity)
router.get('/get', authMiddleware, controller.getUserCart)
router.get('/cart-count',authMiddleware, controller.getCartCount)
module.exports = router;
