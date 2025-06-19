const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }
    const { shippingAddress, paymentMethod } = req.body;
    // Create order from cart
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
    });
    const savedOrder = await order.save();
    // Remove the cart after order is placed
    await Cart.deleteOne({ userId });
    return res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    console.log('status', status)
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate('userId').populate('items.productId');
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId').populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate('items.productId');
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Update order status (admin or user)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Delete an order (admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order deleted', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

// Get orders of a specific status for the logged-in user
exports.getOrdersByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ message: 'Status query parameter is required' });
    }
    const orders = await Order.find({ userId, status }).populate('items.productId');
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', err });
  }
};

module.exports = exports;
