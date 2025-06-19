const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductStatsSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  totalSold: { type: Number, default: 0 },
  customerCount: { type: Number, default: 0 },
  customerIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductStats', ProductStatsSchema); 