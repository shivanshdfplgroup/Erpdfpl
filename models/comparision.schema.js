const mongoose = require('mongoose');

const comparisionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  comparisionId: String,
  prId: String,
  projectId: String,
  projectName: String,
  selectedVendorsIds: [{ type: String }],
  remarks: String,
  isApproved: { type: Boolean, default: false },
  preparedBy:String,
  approvedBy:String,
  approvedOnDate:String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Comparision = mongoose.model('Comparision', comparisionSchema);

module.exports = Comparision;