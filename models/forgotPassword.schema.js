const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  mobile: { type: String},
  email: String,
  role: String,
  type: {
    type: String,
    enum: ["forgotPassword", "changePassword", "changeEmail"],
    required: true
  },
  value: String,
  createdAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false }, // New field
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;