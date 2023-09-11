const mongoose = require('mongoose');

const materialIssueNoteSchema = new mongoose.Schema({
  minId: { type: String, required: true, unique: true },
  company: String,
  userId: String,
  indentId: String,
  indentDate: { type: Date, default: Date.now },
  projectId: String,
  gpId: String,  //Wanted To Make MainId 
  project: String,
  store: String,
  block: String,
  gp: String,
  vendor: String,
  tableData: mongoose.Schema.Types.Mixed,
  minDate:String,
  materialCategory: String,
  materialSubCategory: String,
  materialDescription: String,
  uom: String,
  indentQuantity: Number,
  balanceIndent: Number,
  issuedQuantity:{type:Number,default:0},
  // mrnGpName: String,

  remark: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MaterialIssueNote = mongoose.model('MaterialIssueNote', materialIssueNoteSchema);

module.exports = MaterialIssueNote;