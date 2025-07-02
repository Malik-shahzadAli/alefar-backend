const express = require('express');
const router = express.Router();
const controller = require('../controllers/deals.controller.js');
const authMiddleware = require('../middlewares/auth.js');

// Create a new deal (requires authentication)
router.post("/create-deal", authMiddleware, controller.createDeal);

// Get all deals with pagination (public)
router.get("/get-deals", controller.getDeals);

// Get a single deal by ID (public)
router.get("/deal/:id", controller.getDealById);

// Get active deals (public)
router.get("/active-deals", controller.getActiveDeals);

// Update a deal (requires authentication)
router.put("/update-deal/:id", authMiddleware, controller.updateDeal);

// Delete a deal (requires authentication)
router.delete("/delete-deal/:id", authMiddleware, controller.deleteDeal);

// Add products to a deal (requires authentication)
router.post("/deal/:id/add-products", authMiddleware, controller.addProductsToDeal);

// Remove products from a deal (requires authentication)
router.post("/deal/:id/remove-products", authMiddleware, controller.removeProductsFromDeal);

module.exports = router; 