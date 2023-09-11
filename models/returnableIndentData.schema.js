const mongoose = require('mongoose');

const returnableIndentDataSchema = new mongoose.Schema({
  returnableIndentId: { type: String, required: true, unique: true },
  returnableIndentNumber: String,
  returnableIndentDate: { type: Date },
  poNumber: String,
  materialMainGroup: String,
  materialSubGroup: String,
  itemDescription: String,
  returnableIndentUom: String,
  poQuantity: Number,
  returnableIndentRate: Number,
  returnableIndentAmount: Number,
  returnableIndentQuantity: Number,
  balanceReturnableIndent: Number,
  vendorName: String,
  invoiceNumber: String,
  invoiceDate: { type: Date },
  transporterName: String,
  grDocumentFileKey: String,
  grDate: { type: Date },
  vehicleNumber: String,
  ewayBillNumber: String,
  storageLocation: String,
  returnableIndentContractorName: String,
  returnableIndentGpName: String,
  remark: String,
  isApproved: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ReturnableIndentData = mongoose.model('ReturnableIndentData', returnableIndentDataSchema);

module.exports = ReturnableIndentData;
