const Cart = require("../models/cart.model")
exports.addToCart = async (req, res) => {
    try{
    // let cartData = {...req.body.cartData};
    const { productId, title, price, quantity } = req.body;
    let userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        const newItem = {
            productId,
            title,
            price,
            quantity,
            totalPrice: price * quantity
        };
        cart = new Cart({
            userId,
            items: [newItem],
            totalPrice: price * quantity
        });
        let response =  await cart.save();
        return res.status(200).json(response)
    }
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        let pTotal = cart.items[itemIndex].quantity * cart.items[itemIndex].price;
        cart.totalPrice += pTotal;

    } else {
        // Product doesn't exist in cart, add new item
        let pTotal =  price * quantity
        cart.items.push({
          productId,
          title,
          price,
          quantity,
        });
        cart.totalPrice += pTotal;
    }
    let response =  await cart.save();
    return res.status(200).json(response)
    }catch(err){
        console.error(err);
       return res.status(500).json({ message: 'Server Error', err });
    }
}
exports.getUserCart = async (req,res)=>{
    try{
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        return res.json(cart);
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server Error', err });
    }
}
exports.deleteProductFromCart = async(req,res)=>{
    const {  productId } = req.params;
    const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + ( item.price * item.quantity), 0);
    let response = await cart.save();
    // return res.json(response);
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    return res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
}
exports.updateProductQuantity = async (req, res) => {
    const {  productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
    try {
        console.log(quantity)
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        cart.totalPrice = cart.items.reduce((sum, item) => sum + ( item.price * item.quantity), 0);
        let response = await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('items.productId');;
        return res.json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', err });
    }
}
exports.getCartCount = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(200).json({ message: 'Cart not found', count:0 });
        return res.status(200).json({ message: 'Cart found', count:cart.items.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', err });
    }
}