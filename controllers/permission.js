// please create SiteIndent modal in mongo
const Logs = require("../models/log.model.js");
const Permissions = require("../models/permissions.schema.js");
const getDate = require('../middleware/getDate.js');
const jwt = require("jsonwebtoken");

const Roles = require("../models/roles.schema.js");

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const createPermission = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {

      const alreadyExists =  await Permissions.findOne({
       nameOfComponent:toTitleCase(req.body.nameOfRole).trim(),
       typeOfPermissions:req.body.permission,
       projectId:req.body.projectId
      })
      if(alreadyExists){
        return res
        .status(200)
        .json({ code: 200, message: `Permission name ${alreadyExists.nameOfComponent} ${alreadyExists.typeOfPermissions} Already Exists`});
      }

      const newEntry = await Roles.create(
       
        {
          nameOfComponent:toTitleCase(req.body.nameOfRole).trim(),
          typeOfPermissions:req.body.permission,
          projectId:req.body.projectId        
        }
       
       );
       let message = `Role name ${newEntry.name} created by ${decode.name} on ${getDate.getCurrentDate()}`;

       await Logs.create({
         logs: message,
         userId: req.body.userId,
       });
      return res
        .status(200)
        .json({ code: 200, message: `Role name ${newEntry.name} created by ${decode.name}`, data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 476,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  module.exports = {createPermission}