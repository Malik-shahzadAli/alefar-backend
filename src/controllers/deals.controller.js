var Deals = require('../models/deals.model');
var Product = require('../models/product.model');

// Create a new deal
exports.createDeal = async function (req, res) {
    try {
        const dealData = { 
            ...req.body
        };
        if(!req.body?.products?.length){
            return res.status(400).json({ 
                message: 'products required for creating deal' 
            });
        }
        // Validate that all products exist
        if (dealData.products && dealData.products.length > 0) {
            const productsExist = await Product.find({
                _id: { $in: dealData.products }
            });
            
            if (productsExist.length !== dealData.products.length) {
                return res.status(400).json({ 
                    message: 'Some products do not exist' 
                });
            }
        }
        
        const newDeal = new Deals(dealData);
        const savedDeal = await newDeal.save();
        
        // Populate products for response
        await savedDeal.populate('products');
        
        return res.status(201).json({
            message: 'Deal created successfully',
            deal: savedDeal
        });
    } catch (error) {
        console.error('Create deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Get all deals with pagination
exports.getDeals = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const [deals, total] = await Promise.all([
            Deals.find()
                .populate('products')
                .skip(skip)
                .limit(limit)
                .sort({ created_at: -1 }),
            Deals.countDocuments()
        ]);

        return res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalDeals: total,
            deals
        });
    } catch (error) {
        console.error('Get deals error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Get a single deal by ID
exports.getDealById = async function (req, res) {
    try {
        const deal = await Deals.findById(req.params.id)
            .populate('products')
            .populate('created_by', 'name email');
            
        if (!deal) {
            return res.status(404).json({ 
                message: 'Deal not found' 
            });
        }
        
        return res.json(deal);
    } catch (error) {
        console.error('Get deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Update a deal
exports.updateDeal = async function (req, res) {
    try {
        const dealId = req.params.id;
        // Only allow updating startDate, endDate, and isActive
        const allowedFields = ['startDate', 'endDate', 'isActive'];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        const updatedDeal = await Deals.findByIdAndUpdate(
            dealId, 
            updateData, 
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('products');
        if (!updatedDeal) {
            return res.status(404).json({ 
                message: 'Deal not found' 
            });
        }
        return res.json({
            message: 'Deal updated successfully',
            deal: updatedDeal
        });
    } catch (error) {
        console.error('Update deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Delete a deal
exports.deleteDeal = async function (req, res) {
    try {
        const dealId = req.params.id;
        const deletedDeal = await Deals.findByIdAndDelete(dealId);
        
        if (!deletedDeal) {
            return res.status(404).json({ 
                message: 'Deal not found' 
            });
        }
        
        return res.json({
            message: 'Deal deleted successfully',
            deal: deletedDeal
        });
    } catch (error) {
        console.error('Delete deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Add products to a deal
exports.addProductsToDeal = async function (req, res) {
    try {
        const dealId = req.params.id;
        const { productIds } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ 
                message: 'Product IDs array is required' 
            });
        }
        
        // Validate that all products exist
        const productsExist = await Product.find({
            _id: { $in: productIds }
        });
        
        if (productsExist.length !== productIds.length) {
            return res.status(400).json({ 
                message: 'Some products do not exist' 
            });
        }
        
        const deal = await Deals.findById(dealId);
        if (!deal) {
            return res.status(404).json({ 
                message: 'Deal not found' 
            });
        }
        
        // Add products that are not already in the deal
        const newProducts = productIds.filter(id => 
            !deal.products.includes(id)
        );
        
        if (newProducts.length === 0) {
            return res.status(400).json({ 
                message: 'All products are already in the deal' 
            });
        }
        
        deal.products.push(...newProducts);
        await deal.save();
        
        await deal.populate('products');
        
        return res.json({
            message: 'Products added to deal successfully',
            deal: deal
        });
    } catch (error) {
        console.error('Add products to deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Remove products from a deal
exports.removeProductsFromDeal = async function (req, res) {
    try {
        const dealId = req.params.id;
        const { productIds } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ 
                message: 'Product IDs array is required' 
            });
        }
        
        const deal = await Deals.findById(dealId);
        if (!deal) {
            return res.status(404).json({ 
                message: 'Deal not found' 
            });
        }
        
        // Remove products from the deal
        deal.products = deal.products.filter(id => 
            !productIds.includes(id.toString())
        );
        
        await deal.save();
        await deal.populate('products');
        
        return res.json({
            message: 'Products removed from deal successfully',
            deal: deal
        });
    } catch (error) {
        console.error('Remove products from deal error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Get active deals
exports.getActiveDeals = async function (req, res) {
    try {
        const currentDate = new Date();
        const activeDeals = await Deals.findOne({
            isActive: true,
            $or: [
                { startDate: { $lte: currentDate } },
                { startDate: { $exists: false } }
            ],
            $or: [
                { endDate: { $gte: currentDate } },
                { endDate: { $exists: false } }
            ]
        })
        .populate('products')
        .sort({ created_at: -1 });
        
        return res.json(activeDeals);
    } catch (error) {
        console.error('Get active deals error:', error);
        return res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

module.exports = exports;
