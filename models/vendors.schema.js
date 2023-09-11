const mongoose = require('mongoose');

const vendorsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  mobile: String,
  categories: [{ type: String }],
  gstNo: String,
  address: String,
  invoices: [{ type: String }],
  folderName: String,
  details: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Vendors = mongoose.model('Vendors', vendorsSchema);

module.exports = Vendors;