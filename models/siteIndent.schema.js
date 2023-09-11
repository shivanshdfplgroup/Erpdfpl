const mongoose = require('mongoose');

const siteIndentSchema = new mongoose.Schema({
  indentId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  preparedBy: { type: String }, 
  recommendedBy: { type: String },
  approvedBy: { type: String },
  indentDate: { type: Date, default: Date.now },
  projectId: String,
  project: {type: String, required: true },
  store: { type: String, required: true },
  block: { type: String, required: true },
  gp: { type: String, required: true },
  vendor: String,
  indentStatus: String,
  tableData: mongoose.Schema.Types.Mixed,
  table: [mongoose.Schema.Types.Mixed],
  relatedMins:[{type:String}],
  inventoryCategory: String,
  itemName: String,
  remark: String,
  
},
{
  timestamps:true
}

);

const SiteIndent = mongoose.model('SiteIndent', siteIndentSchema);

module.exports = SiteIndent;
