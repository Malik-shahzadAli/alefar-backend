const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller.js');
const authMiddleware = require('../middlewares/auth.js')
const upload = require('../middlewares/upload.js')
router.post("/add-product", authMiddleware, controller.addProduct);
router.get("/get-products", authMiddleware, controller.getProducts);
router.get("/new-arrivals", controller.getNewArrivals)
router.get("/product/:productId", controller.getSingleProduct)
router.get("/cat-product/:catId", controller.getCategoryProducts)
router.post("/search-product", controller.searchProducts)
router.post('/edit-product/:id', authMiddleware, controller.editProduct)
router.post('/delete-product/:id', authMiddleware, controller.deleteProduct)
router.post('/upload-image',upload.single('file'),controller.uploadImage )
module.exports = router;
