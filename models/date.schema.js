const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema({
  company: {type:String, default:"CIPL"},
  backDate: { type: Boolean, default: false },
  currentDate: { type: Boolean, default: true },
  futureDate: { type: Boolean, default: false },
}, {
  timestamps: true // Add timestamps option to enable createdAt and updatedAt fields
});

const DateEnabled = mongoose.model('DateEnabled', dateSchema);

module.exports = DateEnabled;
