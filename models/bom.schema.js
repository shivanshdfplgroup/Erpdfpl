const mongoose = require('mongoose');

const bomSchema = new mongoose.Schema({
  bomId: { type: String, required: true, unique: true },
  materialName: { type: String, required: true },
  materialDescription: String,
  isApproved: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BOM = mongoose.model('BOM', bomSchema);

module.exports = BOM;