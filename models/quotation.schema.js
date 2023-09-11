const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  quotationId: String,
  projectId: String,
  projectName: String,
  prId: String,
  vendorId: String,
  vendorName: String,
  materialCode: String,
  materialCategory: String,
  materialSubCategory: String,
  materialDescription: String,
  uom: String,
  quantity: Number,
  rate: Number,
  amount: Number,
  gst: String,
  gstAmount: Number,
  remark: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;