const mongoose = require('mongoose');

const boqFormGpWiseSchema = new mongoose.Schema({
  productCode: { type: String, required: true},
  serviceOrSupply: { type: String, required: true, enum: ['Service', 'Supply'] },
  projectId: { type: String, required:true},
  gpId: { type: String, required: true},
  gpName: { type: String, required: true},
  projectName: { type: String, required: true },
  uom: { type: String },
 
 quantity: { type: Number, default: 0 },

});

const BOQFormGPWise = mongoose.model('BOQFormGpWise', boqFormGpWiseSchema);

module.exports = BOQFormGPWise;