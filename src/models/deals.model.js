var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DealsSchema = new Schema(
  {
    products: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true 
    }],
    // discountPercentage: { type: Number, min: 0, max: 100 },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
  },
  {
    usePushEach: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

var Model = mongoose.model('Deals', DealsSchema);

module.exports = Model; 