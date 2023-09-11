const mongoose = require('mongoose');

const grnSchema = new mongoose.Schema({
  grnId: { type: String, required: true, unique: true },
  company: String,
  contractorName: String,
  workOrder: String,
  location: String,
  block: String,
  projectName: String,
  mrNo: String,
  date: { type: Date, default: Date.now },
  items: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const GRN = mongoose.model('GRN', grnSchema);

module.exports = GRN;