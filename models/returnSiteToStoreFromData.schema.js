const mongoose = require('mongoose');

const returnSiteToStoreFormDataSchema = new mongoose.Schema({
  returnSiteToStoreId: { type: String, required: true, unique: true },
  returnSiteToStoreNumber: String,
  returnSiteToStoreDate: { type: Date },
  poNumber: String,
  materialMainGroup: String,
  materialSubGroup: String,
  itemDescription: String,
  returnSiteToStoreUom: String,
  poQuantity: Number,
  rate: Number,
  returnSiteToStoreAmount: Number,
  returnSiteToStoreQuantity: Number,
  balanceReturnSiteToStore: Number,
  vendorName: String,
  invoiceNumber: String,
  invoiceDate: { type: Date },
  transporterName: String,
  grDocumentFileKey: String,
  grDate: { type: Date },
  vehicleNumber: String,
  ewayBillNumber: String,
  storageLocation: String,
  returnSiteToStoreContractorName: String,
  returnSiteToStoreGpName: String,
  remark: String,
  isApproved: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ReturnSiteToStoreFormData = mongoose.model('ReturnSiteToStoreFormData', returnSiteToStoreFormDataSchema);

module.exports = ReturnSiteToStoreFormData;