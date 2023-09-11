const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');
// please create SiteIndent modal in mongo
const SiteIndent = require("../models/siteIndent.schema.js");
const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");


const createIndent = async (req, res) => {
  const token = req.headers.authorization;
  console.log(req.body);
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  // role -> Site Engineer
  try {
    // *******************************************IMP: please get a modal "IdGeneration" and import in the file
    let projectCode = req.body.projectCode
    const sequenceVal = await SiteIndent.find({projectId:req.body.projectId}).count();
    const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
    const uniqueId = `CIPL/${projectCode}/MR/23-24/${paddedSequenceVal}`;
  
    // Create a new document in the 'idGeneration' collection

    console.log(req.body);

    const newEntry = await SiteIndent.create({
      indentId: uniqueId,
      indentDate:req.body.date,
      userId: decode.id,
      preparedBy:decode.name,
      projectId: req.body.projectId,
      project: req.body.project,
      store: req.body.store,
      block: "Shohratgarh",
      gp: req.body.gp,
      vendor: req.body.vendor,
      indentStatus: "Not Approved / Not Recommend",
      inventoryCategory: req.body.inventoryCategory,
      tableData: req.body.tableData,
      itemName: req.body.itemName,
      remark: "dgdfgdfg",
    });

    let message = decode.name+ " " +"created siteIndent entry: "+ uniqueId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      message: "Site Indent form entry created",
      data: newEntry,
    });
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

  
  const getAllIndent = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> HO 

    // if(decode.role!="Admin"){
    //   console.log('go to error');
    //   return res.status(403).json({
    //     code: 302,
    //     message: "Unauthorized access",
    //   });
    // }
  
    try {
      const newEntry = await SiteIndent.find({});
      let message = decode.name+ " " +"retrieved all SiteIndent entries" + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent form entries ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 501,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  // project wise
  const getProjectwiseAllIndent = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> HO 

    // if(decode.role!="Admin"){
    //   console.log('go to error');
    //   return res.status(403).json({
    //     code: 302,
    //     message: "Unauthorized access",
    //   });
    // }
  
    try {
      const newEntry = await SiteIndent.find({
        projectId:req.body.projectId,
      });
      let message = decode.name+ " " +"retrieved all SiteIndent entries of project: "+ req.body.projectName + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent form entries ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 501,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getUserIndent = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // const token =req.headers.authorization;
      // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

      // -> PM, DPM, storeManager, storeIncharge

      const newEntry = await SiteIndent.find({
      userId: decode.id
    }, {
      indentId: true,
      preparedBy:true,
      project: true,
      store: true,
      block: true,
      gp: true,
      vendor: true,
      indentStatus: true,
      inventoryCategory: true,
      itemName: true,
      remark: true,
      indentDate: true,
      tableData: true,
    });
    let message = decode.name+ " " +"retrieved his SiteIndent Entries" + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent form entries ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 502,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  
  const getRecIndent = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> DPM
    // -> logs to HO
    // -> logs to PM

    try {
      const newEntry = await SiteIndent.find({
        
          indentStatus:"Not Approved / Not Recommend"
      });
      let message = decode.name+ " " +"retrieved all Site Indent Form Entries For Recommendation" + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent Form Entries For Recommendation ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 503,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  
  const getAppIndent = async (req, res) => {  // to be approved
    // const token =req.headers.authorization;
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // -> DPM
    // -> logs to HO
    // -> logs to PM

    try {
      const newEntry = await SiteIndent.find({
     
          indentStatus:"Not Approved"
       
      });
      let message = decode.name+ " " +"retrieved all Site Indent Form Entries For Approval" + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent Form Entries For Approval ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 504,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  const getApprovedIndent = async (req, res) => {
    console.log(req.body, "here")
    // const token =req.headers.authorization;
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const newEntry = await SiteIndent.find({
   
          indentStatus:"Approved"
       
      });

      console.log(newEntry)
      let message = decode.name+ " " +"retrieved all Approved Site Indent Form Entries" + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent Form Entries For Approval ", data: newEntry });

    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 505,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };


  const getApprovedIndentByProjectId = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // const token =req.headers.authorization;
    console.log(req.body, "sds")
    try {

      const newEntry = await SiteIndent.find(
       {
          projectId:req.body.projectId,
          indentStatus:"Approved"
        });

      console.log(newEntry)
      let message = decode.name+ " " +"retrieved all Approved Site Indent Form Entries For ProjectId: "+req.body.projectId + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent Form Entries For Approval ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 506,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  // indent to be recommended is to DPM, whenever to be approved -> PM => both logs to DPM
  const editIndent = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    if(req.body.status == 'Approved'){
      try {
        const newEntry = await SiteIndent.updateOne({
       
            indentId:req.body.indentId
          },
          {
            indentStatus:req.body.status,
            approvedBy:decode.name
          }
        );
        let message = decode.name+ " " +`updated Site Indent Form ${req.body.indentId} Status Updated to ${req.body.status}` + " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
        return res
          .status(200)
          .json({ code: 200, message: `Site Indent Form Updated to ${req.body.status}`, data: newEntry });
      } catch (error) {
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 507,
          error: "Please Contact HeadOffice",
          message: "Internal Server Error",
        });
      }
    }
  else{
    try {
      const newEntry = await SiteIndent.updateOne(
      {
          indentId:req.body.indentId
        },
        {
          indentStatus:req.body.status,
          recommendedBy:decode.name
        }
      );
      let message = decode.name+ " " +`updated Site Indent Form ${req.body.indentId} Status Updated to ${req.body.status}` + " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
  
      return res
        .status(200)
        .json({ code: 200, message: `Site Indent Form Updated to ${req.body.status}`, data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 507,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  }};


  
  const getIndentById = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {

      const newEntry = await SiteIndent.findOne(
       {indentId:req.body.indentId});

      console.log(newEntry)
      let message = decode.name+ " " +"retrieved Site Indent Form having Indentid: "+ req.body.indentId + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Site Indent Form Entries For Approval ", data: newEntry });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 508,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  module.exports = {createIndent, getAllIndent, getProjectwiseAllIndent, getAppIndent, getApprovedIndent, getRecIndent, editIndent, getUserIndent, getApprovedIndentByProjectId,getIndentById }