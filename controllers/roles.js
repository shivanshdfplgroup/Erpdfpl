// please create SiteIndent modal in mongo
const Logs = require("../models/log.model.js");
const getDate = require('../middleware/getDate.js');
const Roles = require("../models/roles.schema.js");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};


const createAndEditRoles = async (req, res) => {

  console.log(req.body)
  const  name = toTitleCase(req.body.nameOfRole).trim();
  const permissionsToUpdate = req.body.permissionsData; // Array of permissions

  console.log(name,permissionsToUpdate)
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  try {
    
    let role = await Roles.findOneAndUpdate(
      { name: name },
      {
        $set: {
          name: name,
          permissions: permissionsToUpdate.map(permissionUpdate => ({
            nameOfComponent: toTitleCase(permissionUpdate.nameOfComponent),
            typeOfPermissions: permissionUpdate.typeOfPermissions?.map(permission => ({
              permission: permission.permission.toLowerCase(),
              value: permission.value,
            })),
          })),
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    let message = `Role is Created Or Updated ${role.name} By ${decode.name}` + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      data: role,
      message: `Role is Created Or Updated ${role.name}`,
    });

  } catch (error) {
    console.log(error);
    let message = decode.name+" "+error + " "+getDate.getCurrentDate();

    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 500,
      error,
      message: "Internal Server Error",
    });
  }

  };

  const getRolesByRoleNames = async (req, res) => {

    console.log(req.body)
    if(!req.body || req.body==={})
    {
      {return res.status(200).json({data:""})}
    }
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      if(req.body.role === "SuperUser"){return res.status(200).json({data:""})}
      const roles = await Roles.findOne({
        name:toTitleCase(req.body.role).trim()
      });
      console.log(roles)
      
      const filteredComponents = roles.permissions.filter((component) => {
        return component.typeOfPermissions.some((permission) => permission.value === true);
      });
      let message = decode.name + " " + "retrieved permissions for role: "+req.body.role + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      return res.status(200).json({data:filteredComponents});
    } catch (error) {
      let message = decode.name + " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res.status(500).json({ error: 'Failed to retrieve roles.' });
    }
  
  }
  
  const getAllRoles = async (req, res) => {
    // on super admin we can do it but when we are calling it during registration, we don't have these
    // const token =req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const roles = await Roles.find();
      console.log(roles)
      let message = req.body.userName + " " + "retrieved all roles" + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res.status(200).json({data:roles});
    } catch (error) {
      let message = req.body.userName + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res.status(500).json({ error: 'Failed to retrieve roles.' });
    }
  }

  module.exports = {createAndEditRoles,getRolesByRoleNames,getAllRoles}