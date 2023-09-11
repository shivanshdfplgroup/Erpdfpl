const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.schema");
const Project = require("../models/project.schema");

const updateProjectExcelBom = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // role -> HO, Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role !== "Admin") {
      console.log(req.body.assignedTo);
      return res.status(401).json({ code: 302, message: "You'r Not Admin" });
    }

    const file = req.file;
    console.log(req.file);

    const newProject = await Project.findByIdAndUpdate(req.body.projectId, {
      bomAwsExcel: decodeURIComponent(
        `https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${file.key}`
      ),
    });

    console.log(newProject);
    let message = `Project: ${req.body.projectName} has update with BOM been updated By ${decode.name}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({ code: 200, message: "Bom Update In Project", data: newProject });
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({
        code: 441,
        message: "Internal Server Error",
        error: "Please Contact HeadOffice",
      });
  }
};

const updateProjectExcelBoq = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // role -> HO, Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role !== "SuperUser") {
      return res
        .status(401)  
        .json({ code: 302, message: "You'r Not A SuperUser" });
    }
    console.log(req.body);

    const file = req.file;
    let newBoqExcels = {}
    newBoqExcels.gpId= req.body.gpId,
    newBoqExcels.gpName= req.body.gpName,
    newBoqExcels.boqAws = decodeURIComponent(
      `https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${file.key}`
    )
    
    const newProject = await Project.findOneAndUpdate(
      {id:req.body.projectId},

       
      { $push: { boqExcels: newBoqExcels } },
      { new: true } 
    );

    // console.log(newProject);

    let message = `Project: ${req.body.projectName} has update with BOM been updated By ${decode.name}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({ code: 200, message: "Boq Update In Project", data: newProject });


  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({
        code: 442,
        message: "Internal Server Error",
        error: "Please Contact HeadOffice",
      });
  }
};
module.exports = { updateProjectExcelBom, updateProjectExcelBoq };
