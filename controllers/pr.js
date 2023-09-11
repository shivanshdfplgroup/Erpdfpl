const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const PR = require("../models/pr.schema.js");
const User = require("../models/user.schema");
const Project = require("../models/project.schema.js");

const createPr = async (req, res) => {
    const token =req.headers.authorization;
    console.log(token)
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  
    // -> PM
    try {
      const project = await Project.findOne({name:req.body.projectName})
      const sequenceVal = await PR.find({projectId:req.body.projectId}).count();
      const paddedSequenceVal = String(sequenceVal + 1).padStart(5, '0');
      const uniqueId = `CIPL/${project.projectCode}/PR/23-24/${paddedSequenceVal}`;
    
      const newEntry = await PR.create({
    
          prId: uniqueId,
          userId: decode.id,
          preparedBy:decode.name,
          projectName:req.body.projectName,
          projectId:req.body.projectId,
          projectCode:project.projectCode,
          prDate:req.body.date,
          // miDate:new Date(Date.now()),
          // miNumber:req.body.miNumber,
          // clientName:req.body.client,
          employer:req.body.employer,
          deliveryAdd:req.body.deliveryAddress,
          // makePreference:req.body.makePreference,
          // qualityInstruction:req.body.qualityInstruction,
          // documents:req.body.documentsWithMaterial,
          // materialDesc:req.body.materialDesc,
          // unit:req.body.unit,
          // quantity:req.body.quantity,
          tableData:req.body.tableData,
          remarks:req.body.remarks,
          qualityInstruction:req.body.qualityInstruction,
          
      
      });
      let message = decode.name+ " created New PR Entry with prId: "+ uniqueId + " " + getDate.getCurrentDate();
      await Logs.create({
        logs: message+" "+getDate.getCurrentDate(),
        userId: req.body.userId,
      });
  
      return res
        .status(200)
        .json({ code: 200, message: "Site PR form entry created", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 482,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

const getAllPr = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // get = PM, approval = HO
    console.log(decode.role)
    
    try {
     
      const newEntry = await PR.find();
      let message = decode.name+ " " +"retrieved All PRs"+" "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
      return res
        .status(200)
        .json({ code: 200, message: "Send All PR Related To Project", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 483,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };


  const getNotApprovedPr = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // const token =req.headers.authorization;
    // console.log(token)
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // get = PM, approval = HO
    // if(decode.role !== 'Admin') return res.status(400).json({message: "You Didn't Belong to Admin"});
    try {
     
      console.log(req.body)
      let user = await User.find({id:req.body.userId})

      let projects = user[0].projectsAssigned;

      const newEntry = await PR.find({
        projectId: { $in: projects },
        // status: false
    });
        console.log(newEntry,"dgdfg")
        let message = decode.name+ " " +"retrieved Not Approved PRs for his projects"+" "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
      return res
        .status(200)
        .json({ code: 200, message: "Send Not Approved PR Related To Project", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 484,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };


  const getApprovePr = async (req, res) => {
    // console.log(req.body,"hello")
    const token =req.headers.authorization;
    // console.log(token)
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // get = PM, approval = HO
    // if(decode.role !== 'Admin') return res.status(400).json({message: "You Didn't Belong to Admin"});
    try {
      const newEntry = await PR.findOneAndUpdate(
        {
          projectId: req.body.projectId,
          prId:  req.body.prIds 
        },
        {
          $set: {
            status: true,
            approvedBy: decode.name
          }
        },
        { new: true }
      );
      // console.log("Here",newEntry )
      let message = decode.name+ " " +"retrieved Approved PRs for projectId: "+ req.body.projectId + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res
        .status(200)
        .json({ code: 200, message: "Purchase Requisition Approved, Sent To Purchase Department", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 485,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

module.exports = {createPr, getAllPr, getNotApprovedPr, getApprovePr}