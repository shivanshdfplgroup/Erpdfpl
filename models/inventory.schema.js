const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  id: { type: String },
  projectName: String,
  projectId: String,
  gpName: String,
  gpId: String,
  // companyName: String,
  // serialNo: Number,
  // directoryNo: String,
  // recievedDate: String,
  materialCategory: String,
  materialSubCategory: String,
  materialDescription: String,
  units: Number,
  
  uom: String,
  dispatchedQty: Number,
  recdQty: Number,
  recievedQty: {type: Number,default:0},
  boqQty: Number,
  // vendorName: String,
  // vendorID: String,
  // vendorAddress: String,
  // transportName: String,
  // AWB_no: String,
  // AWB_DT: String,
  // eway_bill_no: String,
  // vendorInvoiceNo: String,
  // commInvoiceNo: String,
  // date: String,
  // status: String,
  // vehicleNo: String,
  // vehicleReleasedAtSite: String,
  // vehicleReleasedFromSite: String,
  // storage: String,
  // ownedGP: String,
  transferredGP: [String], // an array of strings
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
