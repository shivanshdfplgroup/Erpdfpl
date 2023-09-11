const mongoose = require('mongoose');

const mtoSchema = new mongoose.Schema({
  mtoId: { type: String, required: true, unique: true },
  userId: String, // Can be changed to store id if needed
  // mtoNumber: String,
  mtoDate: Date,
  // mrnDate: Date,
  projectId:String,
  projectName:String,
  transferFromGpName:String,
  transferToGpName:String,
  tableData: mongoose.Schema.Types.Mixed,
  // mtoDescription: String,
  // mtoUom: String,
  // mtoQuantity: Number,
  // mtoRate: Number,
  // mtoAmount: Number,
  mtoContractorName: String,
  // mtoGpName: String,
  remark: String,
  isApproved: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MTO = mongoose.model('MTO', mtoSchema);

module.exports = MTO;
