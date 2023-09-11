const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  documentName: String,
  inventoryId: String,
  s3Key: String,
  is_deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Documents = mongoose.model('Documents', documentsSchema);

module.exports = Documents;