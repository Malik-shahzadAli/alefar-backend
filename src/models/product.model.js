var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, unique: true },
    category: { type: String },
    description: { type: String },
    inventory: { type: Number }, // stock of the product
    product_images: [],
    displayPrice:{type:Number},
    price:{type:Number},
    Color: {
      type: [
        {
          img:{
            original: String,
            '100': String,
          },
          Color: String,
        },
      ],
    },
    Material: {
      type: [
        {
          Material: String
        },
      ],
    },
    Length: {
      type: [
        {
          Length: String
        },
      ],
    },
    Size: {
      type: [
        {
          Size: String
        },
      ],
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
  },
  {
    usePushEach: true,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);
var Model = mongoose.model('Product', ProductSchema);

module.exports = Model;
