var Product = require('../models/product.model');

exports.addProduct = async function (req, res) {
    let product = { ...req.body }
    var newProduct = new Product(product);
    let response = await newProduct.save();
    return res.status(200).json(response)
}
exports.editProduct = async function (req, res) {
    const productId = req.params.id;
    const updatedData = req.body;
    try {
      const product = await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
        runValidators: true
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully', product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
}
exports.deleteProduct = async function(req,res){
    const productId = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.getNewArrivals = async (req, res) => {
    try {
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(10);
        res.json(latestProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        return res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.getCategoryProducts = async (req, res) => {
    try {
        const product = await Product.find({ category: req.params.catId });
        return res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.body;
        console.log('====', query);

        const products = await Product.find({
            title: { $regex: query, $options: 'i' }
        });

        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.uploadImage = async(req,res)=>{
  return res.json({
    message: 'File uploaded successfully!',
    fileUrl: req.file.location,
  });
}

module.exports = exports;