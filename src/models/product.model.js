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

// Helper function to generate slug from title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')          // Replace & with 'and'
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\-]/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')            // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
}

ProductSchema.pre('save', async function(next) {
  if (!this.isModified('title')) return next();
  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let count = 1;
  // Check for uniqueness
  while (await mongoose.models.Product.findOne({ slug })) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    count++;
    if (count > 10) break; // Prevent infinite loop
  }
  this.slug = slug;
  next();
});

var Model = mongoose.model('Product', ProductSchema);

module.exports = Model;
