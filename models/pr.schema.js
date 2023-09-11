const mongoose = require('mongoose');

const prSchema = new mongoose.Schema({
  prId: { type: String, required: true, unique: true },
  userId: String,
  preparedBy: String,
  approvedBy:String,
  prDate: { type: Date },
  projectName: String,
  projectId: String,
  projectCode: String,
  miNumber: String, // Marked as Waste in the comment, but keeping it for reference
  miDate: String,   // Marked as Waste in the comment, but keeping it for reference
  clientName: String, // Marked as Waste in the comment, but keeping it for reference
  requestedDate: String, // Marked as Waste in the comment, but keeping it for reference
  employer: String, // Marked as Waste in the comment, but keeping it for reference
  materialDesc: String, // Marked as Waste in the comment, but keeping it for reference
  unit: String, // Marked as Waste in the comment, but keeping it for reference
  quantity: String, // Marked as Waste in the comment, but keeping it for reference
  tableData: mongoose.Schema.Types.Mixed,
  remark: String,
  prStatus:{ type: Boolean, default: false },

  status: { type: Boolean, default: false },
  deliveryAdd: String,
  makePreference: String,
  qualityInstruction: String,
  inspectionInstruction: String,
  documents: String,
  remarks: String,

},
{timestamps:true}

);

const PR = mongoose.model('PR', prSchema);

module.exports = PR;