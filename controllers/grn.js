const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const GRN = require("../models/grn.schema.js");
const User = require("../models/user.schema");
const Project = require('../models/project.schema.js');

const createGrn = async (req, res) => {
    const token =req.headers.authorization;
    // console.log('increate grn',req.body)
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  
    // -> PM

    try {
      let project = await Project.findOne({name:req.body.project})
      const sequenceVal = await GRN.find({projectName:req.body.project}).count()
      const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
      const uniqueId = `CIPL/GRN/23-24/${paddedSequenceVal}`;
      
      const newEntry = await GRN.create({
          grnId: uniqueId,
          contractorName: req.body.contractorName,
          workOrder: req.body.workOrder,
          location: req.body.gp,
          block: req.body.block,
          projectName:req.body.project,
          mrNo: req.body.minNumber,
          date: req.body.date,
          items:req.body.items,
          company: req.body.company,
      });
      let message = decode.name+ " " +"created GRN entry "+ newEntry.grnId + " on"+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      console.log('created GRN', newEntry);
      return res
        .status(200)
        .json({ code: 200, message: "GRN created", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 500,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getAllGrn = async (req, res) => {
    const token =req.headers.authorization;
    // console.log(token)
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
     
      const newEntry = await GRN.find();
      let message = decode.name+ " " +"fetched all GRN entries "+ " on"+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Send All GRN", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 500,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  


module.exports = { createGrn, getAllGrn }