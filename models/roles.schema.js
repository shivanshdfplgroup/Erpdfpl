const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    {
      nameOfComponent: String,
      typeOfPermissions: [
        {

          permission:
          {type: String,
          required: true},
          value:{type:Boolean, default:false}
        },
      ],
    },
  ],
  company:String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rolesSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Roles = mongoose.model("Roles", rolesSchema);

module.exports = Roles;
