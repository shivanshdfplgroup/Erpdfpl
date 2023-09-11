const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require("../middleware/getDate.js");

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const MRN = require("../models/mrn.schema.js");
const Inventory = require("../models/inventory.schema");
const PurchaseOrder = require("../models/purchaseOrder.schema");
const ProjectStock = require("../models/projectstock.schema.js");
const Project = require("../models/project.schema.js");

const createMrnEntry = async (req, res) => {
  // po ko hum validate kr denge right, then it will create an MRN from it
  // role -> storeManager
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const {
      mrnDate,
      poId,
      vendorName,
      invoiceNumber,
      invoiceDate,
      transporterName,
      vehicleNumber,
      ewayBillNumber,
      storageLocation,
      projectName,
      projectId,
      tableData,
      company,
    } = req.body;

    let project = await Project.findOne({id:req.body.projectId})
      const sequenceVal = await MRN.find({projectId:req.body.projectId}).count();
const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
const uniqueId = `CIPL/${project.projectCode}/MaterialReceiptNotes/23-24/${paddedSequenceVal}`;
  
    const receiptsOfEachMaterial = [];
  
    for (const rowData of tableData) {
      try {
        const   balance_quantity = parseInt(rowData.balance_quantity);
        
        const quantity_received = parseInt(rowData.quantity_received);
        const quantity = parseInt(rowData.quantity);
  
        const newEntry = await MRN.create({
          id: uuidv4(),
          mrnId: uuidv4(),
          mrnsId: uniqueId,
          mrnDate,
          poId,
          projectId,
          projectName,
          materialCategory: rowData.materialCategory,
          materialSubCategory: rowData.materialSubCategory,
          materialDescription: rowData.materialDescription,
          poQuantity: quantity,
          balanceMrn: balance_quantity - quantity_received, 
          uom: rowData.uom,
          mrnQuantity: quantity_received,
          mrnRate:parseFloat(rowData.rate),
          mrnAmount:parseFloat(rowData.rate*quantity_received),
          remark: rowData.remark,
          vendorName,
          invoiceNumber,
          invoiceDate,
          transporterName,
          vehicleNumber,
          ewayBillNumber,
          storageLocation,
          company,
        });
  
        receiptsOfEachMaterial.push(newEntry);

  
        const inventoryQuery = {
          projectId,
          projectName,
          materialCategory: rowData.materialCategory,
          materialSubCategory: rowData.materialSubCategory,
          materialDescription: rowData.materialDescription,
        };
  
        await ProjectStock.findOneAndUpdate(
          inventoryQuery,
          { $inc: { units: parseInt(rowData.quantity_received) } },
          { upsert: true }
        );
      } catch (error) {
        console.log(error);
      }
    }

    const allHaveZeroBalanceMrn = receiptsOfEachMaterial.every(obj => obj.balanceMrn === 0);
  
    const updatePo = await PurchaseOrder.findOneAndUpdate(
      { poId },
      { $push: { relatedMrns: uniqueId },
    $set:{orderStatus:allHaveZeroBalanceMrn?"Close":"Open"}
    },
      { new: true }
    );
    let message = decode.name+ " " +"created new MRN entry with mrnsId: "+ uniqueId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    let mrnData = await MRN.findOne({mrnsId: uniqueId})
    const materialReceiptEntries = await MRN.find({
      mrnsId: uniqueId,
    }).select(
      'materialCategory materialSubCategory materialDescription mrnUom poQuantity balanceMrn mrnQuantity'
    );


    return res.status(200).json({
      code: 200,
      message: "MRN form entry created",
      data: mrnData,
      tableData:materialReceiptEntries
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 470,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getMrnRelatedToPo = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const poId = req.body.poId;
    const vendorName = req.body.vendorName;

    // console.log(vendorName,poId)
    let mrnId = await PurchaseOrder.findOne({ poId: poId });
    let collectedData = [];
    if (mrnId.relatedMrns.length > 0) {
      mrnId = mrnId.relatedMrns[mrnId.relatedMrns.length - 1];

      console.log(mrnId);
      const mrnArrived = await MRN.find({ mrnsId: mrnId });
      console.log('mrnArrived', mrnArrived);

      collectedData = mrnArrived.map((item) => ({
        materialCategory: item.materialCategory,
        materialSubCategory: item.materialSubCategory,
        materialDescription: item.materialDescription,
        uom: item.uom,
        quantity: item.poQuantity,
        quantity_received: item.mrnQuantity,
        balance_quantity: item.balanceMrn === 0 ? 0 : item.balanceMrn,
      }));
      console.log("herer");
    }
    console.log('collectedData', collectedData);

    if (collectedData.length < 1 || !collectedData) {
      let po = await PurchaseOrder.findOne({ poId: poId });
      collectedData = po.tableData;
    }
    let message = decode.name+ " " +"fetched MRN related to poId: "+ req.body.poId + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ message: "success", code: 200, data: collectedData });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 471,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getMrnRelatedToProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const projectId = req.body.projectId;

    const mrnArrived = await MRN.find({ projectId: projectId });
    let message = decode.name+ " " +"retrieved all MRN related to projectId: "+ projectId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ message: "success", code: 200, data: mrnArrived });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 472,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getMrnTableByMrnId = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const mrnId = req.body.mrnId;
    console.log(mrnId);

    const mrnArrived = await MRN.find({ mrnsId: mrnId });

    const collectedData = mrnArrived.map((item) => ({
      materialCategory: item.materialCategory,
      materialSubCategory: item.materialSubCategory,
      materialDescription: item.materialDescription,
      uom: item.uom,
      quantity: item.poQuantity,
      quantity_received: item.mrnQuantity,
      balance_quantity: item.balanceMrn === 0 ? 0 : item.balanceMrn,
    }));
    let message = decode.name+ " " +"fetched MRN with mrnId: "+ mrnId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({ message: "success", code: 200, data: collectedData });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 473,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getSingleMRN = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    try {
      const newEntry = await MRN.find({ mrnsId: req.body.mrnId });

      const collectedData = newEntry.map((item) => ({
        materialCategory: item.materialCategory,
        materialSubCategory: item.materialSubCategory,
        materialDescription: item.materialDescription,
        uom: item.uom,
        poQuantity: item.poQuantity,
        mrnQuantity: item.mrnQuantity,
        balanceMrn: item.balanceMrn === 0 ? 0 : item.balanceMrn,
      }));
    
      let message = decode.name+ " " +"fetched MRN with mrnId: "+ req.body.mrnId + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      return res
        .status(200)
        .json({ code: 200, message: "Material Receipt Note ", data: newEntry[0], tableData:collectedData });

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

module.exports = {
  createMrnEntry,
  getMrnRelatedToPo,
  getMrnRelatedToProject,
  getMrnTableByMrnId,
  getSingleMRN
};
