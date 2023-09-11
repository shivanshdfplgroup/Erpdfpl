const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  projectCode:{ type: String, required: true },
  assignedTo: [{ type: String }],
  vendorAssignedTo: [{ type: String }],
  contractorAssignedTo: [{ type: String }],
  gpName: [{type:Object}],
  blockName: String,
  locationName: String,
  stores: [{ type: String }],
  bomAwsExcel: [{ type: String }],
  boqAwsExcel: {type:String},
  boqExcels: [{ gpName:String, gpId:String, boqAws: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
