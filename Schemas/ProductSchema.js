const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index:true,
    required: true
  },
  // Additional subcategory properties
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index:true,
    required: true

  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  }],
  // Additional category properties
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  uom: {
    type: String,
    required: true,
  },
  category:{type:mongoose.Schema.Types.ObjectId, ref:'Category', required: true},
  subcategory:{type:mongoose.Schema.Types.ObjectId, ref:'SubCategory', required: true},
  // Additional category properties
});

productSchema.index({ productCode: 1 }, { unique: true });
subcategorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ name: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);
const Category = mongoose.model('Category', categorySchema);

module.exports= {
  Subcategory,
  Category,
  Product
};
