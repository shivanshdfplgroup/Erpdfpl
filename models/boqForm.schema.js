const mongoose = require('mongoose');

const boqFormSchema = new mongoose.Schema({
  productCode: { type: String, required: true},
  serviceOrSupply: { type: String, required: true, enum: ['Service', 'Supply'] },
  projectId: { type: String, required: true},
  projectName: { type: String, required: true },
 
  totalQuantity: { type: Number, default: 0 },
  totalQuantityFromGps: { type: Number, default: 0 }
});

const BOQForm = mongoose.model('BOQForm', boqFormSchema);

module.exports = BOQForm;