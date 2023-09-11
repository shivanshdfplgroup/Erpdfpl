const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poId: { type: String, required: true, unique: true },
  company: String,
  projectName: String,
  projectId: String,
  poDate: String,
  quotationDate: String,
  msName: String,
  msAddress: String,
  msGst: String,
  contactPersonName: String,
  contactPersonMobile: String,
  contactPersonEmail: String,
  poValidity: String,
  orderStatus: String,
  subjectOfPo: String,
  referrenceSite: String,
  tableData: mongoose.Schema.Types.Mixed,
  changedBillingAddress: String,
  billingAddress: String,
  deliveryAddress: String,
  secondaryDeliveryAddress: String,
  deliveryTerms: String,
  deliveryTime: String,
  paymentTerms: String,
  tpiStatus: String,
  contactAtHeadOffice: String,
  quantityAndQuality: String,
  otherTermsInDPR: String,
  documentS3Key: String,
  poStatus: String,
  relatedMrns: [{type:String}],
  preparedBy:String,

  pdfOfPurchaseOrder: String,

  isApproved: { type: Boolean, default: false },
  approvedBy:String,
  approvedOnDate:String,
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports = PurchaseOrder;
