const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  mobile: { type: String, unique: true },
  password: String,
  company: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  otp: Number,
  isVerified: Boolean,
  email: String,
  projectsAssigned: [{ type: String }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;