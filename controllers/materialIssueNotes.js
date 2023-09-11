const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const MaterialIssueNote = require("../models/materialIssueNote.schema.js");
const SiteIndent = require("../models/siteIndent.schema.js");
const Project = require("../models/project.schema.js");

const createMaterialIssueNote = async (req, res) => {
    const token =req.headers.authorization;
    console.log(req.body)
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // role -> Site Engineer
  // change sequva Val + 5 to 1
    try {
      let project = await Project.findOne({id:req.body.projectId})
      const sequenceVal = await MaterialIssueNote.find({projectId:req.body.projectId}).count();
      const paddedSequenceVal = String(sequenceVal + 5).padStart(5, '0');
      const uniqueId = `CIPL/${project.projectCode}/MIN/23-24/${paddedSequenceVal}`;
      

      console.log(req.body)
      let tableData = req.body.tableValue

      for (const material of tableData) {
        if (!material.quantity_balance){
          material.quantity_balance=material.quantity_requested
        }
    let ans= await MaterialIssueNote.findOneAndUpdate(
      {
        indentId: req.body.detailsOfMr.indentId,
        indentDate: req.body.detailsOfMr.indentDate,
        userId: decode.id,
        projectId: req.body.projectId,
        minDate:req.body.minDate,
        gp: req.body.detailsOfMr.gp,
        vendor: req.body.detailsOfMr.vendor,
        materialCategory:material.materialCategory,
        materialSubCategory:material.materialSubCategory,
        materialDescription:material.materialDescription,
        uom:material.uom,
      },

      {
          company: req.body.company,
          minId: uniqueId,
          indentId: req.body.detailsOfMr.indentId,
          indentDate: req.body.detailsOfMr.indentDate,
          userId: decode.id,
          projectId: req.body.projectId,
          project: req.body.detailsOfMr.project,
          store: req.body.detailsOfMr.store,
          block: req.body.detailsOfMr.block,
          gp: req.body.detailsOfMr.gp,
          minDate:new Date(req.body.minDate),
          vendor: req.body.detailsOfMr.vendor,
          materialCategory:material.materialCategory,
          materialSubCategory:material.materialSubCategory,
          materialDescription:material.materialDescription,
          uom:material.uom,
          indentQuantity:parseInt(material.quantity_requested),
          balanceIndent:parseInt(material.quantity_balance)- parseInt(material.quantity_issued),
          issuedQuantity:parseInt(material.quantity_issued),
          remark:"Success"
       
      },
      {
        new:true,
        upsert:true
      }
      
      );
      console.log(ans, "Here")
    }

    const updateIndent = await SiteIndent.findOneAndUpdate(
      { indentId:req.body.detailsOfMr.indentId },
      { $push: { relatedMins: uniqueId } },
      { new: true }
    );
    let message = decode.name+ " " + "Created Material Issue Note " +uniqueId+ " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  // return;
      let minData = await MaterialIssueNote.findOne({minId: uniqueId})
      const materialEntries = await MaterialIssueNote.find({
        minId: uniqueId,
      }).select(
        'materialCategory materialSubCategory materialDescription uom indentQuantity balanceIndent issuedQuantity'
      );

      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Note created", data:minData, tableData:materialEntries });


    } catch (error) {
      console.log(error, "Dfd");
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 447,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  
  const getAllMIN = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> HO 

    if(decode.role!="Admin"||decode.role!="SuperUser"){
      console.log('go to error')
      return res.status(500).json({code:302, message:"You are not Admin"})
    }
  
    try {
      const newEntry = await MaterialIssueNote.find();
      let message = decode.name+ " " + "retrieved all MaterialIssueNotes" + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Note entries ", data: newEntry });

    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 448,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  const getLatestMinRelatedToMrn = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> HO 

   
    try {
      console.log(req.body.indentId)
      const newEntry = await SiteIndent.findOne({
        indentId:req.body.indentId       
      });
      console.log(newEntry)
          let collectedData = [];
          if (newEntry.relatedMins.length > 0) {
          let latestMin = newEntry.relatedMins[newEntry.relatedMins.length - 1];
      
            const minArrived = await MaterialIssueNote.find({ minId: latestMin });
      
            collectedData = minArrived.map((item) => ({
              materialCategory: item.materialCategory,
              materialSubCategory: item.materialSubCategory,
              materialDescription: item.materialDescription,
              uom: item.uom,
              indentQuantity: item.indentQuantity,
              balanceIndent: item.balanceIndent === 0 ? 0 : item.balanceIndent,
              issuedQuantity:item.issuedQuantity
            }));
          }
          console.log(collectedData)
      
          if (collectedData.length < 1 || !collectedData) {
            let indent = await SiteIndent.findOne({ indentId: req.body.indentId });
            collectedData = indent.tableData;
          }
   
    
          let message = decode.name+ " " + " fetched Material Issue Note entries related to MRN with id "+req.body.indentId + " on "+getDate.getCurrentDate();
          await Logs.create({
            logs: message,
            userId: req.body.userId,
          });
      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Note entries ", data: collectedData });

    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 448,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  

  const getMINByProjectId = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log(req.body, "sds")
    try {

      const newEntry = await MaterialIssueNote.find({
     
          projectId:req.body.projectId,
      
      });

      console.log(newEntry)
      let message = decode.name+ " " + "fetched all Material Issue Notes for projectId: " + req.body.projectId + " on "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Notes Project Wise", data: newEntry });


    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 449,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getVendorWiseMIN = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> HO 
  
    // if(decode.role!="Admin"&&decode.role!="SuperUser"){
    //   console.log('go to error')
    //   return res.status(500).json({code:200, message:"You are not Admin"})
    // }
    let data =[]
  
    try {
      const newEntry = await MaterialIssueNote.find({vendor:req.body.vendorName});
      let message = decode.name+ " " + "fetched all Material Issue Notes for vendor: " + req.body.vendorName + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Note entries ", data: newEntry });

    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 450,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const   getSingleMIN = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  console.log(req.body.minId)
    try {
      const newEntry = await MaterialIssueNote.find({minId:req.body.minId});

      console.log(newEntry, "Her1")
      let collectedData = newEntry.map((item) => ({
        materialCategory: item.materialCategory,
        materialSubCategory: item.materialSubCategory,
        materialDescription: item.materialDescription,
        uom: item.uom,
        indentQuantity: item.indentQuantity,
        balanceIndent: item.balanceIndent === 0 ? 0 : item.balanceIndent,
        issuedQuantity:item.issuedQuantity
      }));
      console.log(collectedData, "Her2")
    
      let message = decode.name+ " " + "fetched Material Issue Note with minId: " + req.body.minId + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      return res
        .status(200)
        .json({ code: 200, message: "Material Issue Note entries ", data: newEntry[0], tableData:collectedData });

    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 451,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };


  // indent to be recommended is to DPM, whenever to be approved -> PM => both logs to DPM
  
  module.exports = {createMaterialIssueNote, getAllMIN, getMINByProjectId, getVendorWiseMIN,getSingleMIN,getLatestMinRelatedToMrn }