var User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.signup = async function (req, res) {
    let product = { ...req.body }
    var newUser = new User(product);
    let response = await newUser.save();
    return res.status(200).json(response)
}
exports.editUser = async function (req, res) {
    const userId = req.params.id;
    const updatedData = req.body;
    try {
      const user = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Product updated successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
}
exports.deleteUser = async function(req,res){
    const userId = req.params.id;
  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Product deleted successfully', user: deleteUser });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.login = async function (req,res) {
    try{
        const { email, password } = req.body;
        const SECRET_KEY ="myTestKey";
        const user = await User.findOne({ email });
        if(!user || password !== user.password){
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, username: user.username,email:user.email,firstName:user.firstName,lastName:user.lastName }, SECRET_KEY, {
            expiresIn: '1h',
        });
        return res.status(200).json({ message: 'Login successful', token });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }

}
exports.verifyToken = async function (req,res){
    return res.status(200).json(req.user);
}
// exports.getNewArrivals = async (req, res) => {
//     try {
//         const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(10);
//         res.json(latestProducts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
exports.getSingleProduct = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
// exports.getCategoryProducts = async (req, res) => {
//     try {
//         const product = await Product.find({ category: req.params.catId });
//         return res.status(200).json(product);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// }
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.body;
        console.log('====', query);
        const users = await User.find({
            title: { $regex: query, $options: 'i' }
        });
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};
  

module.exports = exports;