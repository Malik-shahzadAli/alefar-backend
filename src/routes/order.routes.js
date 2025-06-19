const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller.js');
const authMiddleware = require('../middlewares/auth.js');

// Create a new order
router.post('/create', authMiddleware, controller.createOrder);
// Get all orders (admin)
router.get('/all', authMiddleware, controller.getAllOrders);
//
router.get('/hot-selling', controller.getHotSellingProducts);
// Get a single order by ID
router.get('/:id', authMiddleware, controller.getOrderById);
// Get orders for the logged-in user
router.get('/user/orders', authMiddleware, controller.getUserOrders);
// Update order status
router.post('/update-status/:id', authMiddleware, controller.updateOrderStatus);
// Delete an order
router.delete('/delete/:id', authMiddleware, controller.deleteOrder);
// Get orders of a specific status for the logged-in user
router.get('/status', authMiddleware, controller.getOrdersByStatus);
// Get hot selling products

//pi/order/hot-selling
module.exports = router;
