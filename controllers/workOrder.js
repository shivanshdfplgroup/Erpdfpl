const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const WorkOrder = require("../models/workorder.schema");
const { sendEmail } = require("../middleware/sendEmailWithMessage.js");
const Project = require("../models/project.schema.js");

const createWorkOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const userId = req.body.userId;
    // console.log(req.body);
    // const token =req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    // console.log(req.body, "here")
    let company = req.body.nameOfCompanyInAddress;

    if (company === "CARBYNE INFRASTRUCTURE PRIVATE LIMITED") {
      company = "CIPL";
    } else {
      company = "SBPL";
    }
    console.log(req.body.projectData.id) 
    let project = await Project.findOne({_id:req.body.projectData.id})

    const sequenceVal = await WorkOrder.find({projectId:req.body.projectData.id}).count();
   
    const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
    const uniqueId = `${company}/${project.projectCode}/WO/${paddedSequenceVal}`;
    // console.log(req.body.tableData)

    const workOrder = await WorkOrder.create({
      workOrderId: uniqueId,
      vendorId: req.body.vendorId,
      vendorName: req.body.vendorName,
      name: req.body.name,
      address: req.body.address,
      workOrderDate: new Date(req.body.workOrderDate),
      quotationDate: new Date(req.body.quotationDate),
      gstInNo: req.body.gstInNo,
      panNo: req.body.panNo,
      kindAttn: req.body.kindAttn,
      mobileNo: req.body.mobileNo,
      emailId: req.body.emailId,
      subject: req.body.subject,
      tableData: req.body.tableData,
      scopeOfWork: req.body.scopeOfWork,
      priceBasis: req.body.priceBasis,
      taxesAndDuties: req.body.taxesAndDuties,
      paymentTerms: req.body.paymentTerms,
      workCompletionSchedule: req.body.workCompletionSchedule,
      keyMaterialsProcurement: req.body.keyMaterialsProcurement,
      inspections: req.body.inspections,
      defectLiabilityPeriod: req.body.defectLiabilityPeriod,
      safetyRequirement: req.body.safetyRequirements,
      statutoryRequirement: req.body.statutoryRequirements,
      otherTermAndCondition: req.body.otherTermAndCondition,
      general: req.body.general,
      other: req.body.other,
      note: req.body.note,
      transportation: req.body.transportation,
      billingAddress: req.body.billingAddress,
      deliveryAddress: req.body.deliveryAddress,
      performanceAndTermination: req.body.performanceAndTermination,
      nameOfCompanyInAddress: req.body.nameOfCompanyInAddress,
      preparedBy:decode.name,

      projectId:req.body.projectData.id,
      projectName:req.body.projectData.name
      // pdfOfWorkOrder: decodeURIComponent(`https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${req.file.key}`)
    });
    //   IMP: remember to replace req.body.value as no value field in this schema
    let message = `${decode.name} created WorkOrder ${
      uniqueId
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder Created", data: workOrder });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 527,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getAllWorkOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const userId = req.body.userId;

    const workOrders = await WorkOrder.find().sort({ workOrderDate: -1 });

    let message = `${decode.name} wants all WorkOrders on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrders Fetched", data: workOrders });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 528,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const getWorkOrderById = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const workOrderId = req.body.workOrderId;
    const userId = req.body.userId;

    const workOrders = await WorkOrder.findOne({
      workOrderId: workOrderId,
    });

    let message = `${decode.name} wants a WorkOrder with id: ${req.body.workOrderId} on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder Fetched", data: workOrders });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 529,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getWorkOrderByProjectId = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const projectId = req.body.projectId;
    const userId = req.body.userId;

    const workOrders = await WorkOrder.find({
      // projectId: projectId,
      projectName: req.body.projectName,
    });

    let message = `${decode.name} wants all WorkOrders of project : ${req.body.projectName} on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    console.log('came here', projectId,workOrders);
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder Fetched", data: workOrders });
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

const updateWorkOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const userId = req.body.userId;
    console.log(req.body.amend);

    const workOrder1 = await WorkOrder.findOne({
      workOrderId: req.body.workOrderId,
      amend: req.body.amend ? req.body.amend : 0,
    });
    console.log(workOrder1, console.log("gergerg"));

    const workOrder = await WorkOrder.findOneAndUpdate(
      {
        workOrderId: req.body.workOrderId,
        amend: req.body.amend ? req.body.amend : 0,
      },
      {
        pdfOfWorkOrder: decodeURIComponent(
          `https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${req.file.key}`
        ),
      }
    );
    //   IMP: remember to replace req.body.value as no value field in this schema

    sendEmail("Work Order Approval",`${workOrder.workOrderId}--${workOrder.amend} is Prepared By ${workOrder.preparedBy} On ${getDate.getCurrentDate()} Please Approve.`, process.env.SUPER_ADMIN_EMAIL_ID)

    let message = `${decode.name} update WorkOrder  ${
      workOrder.workOrderId
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder updated", data: workOrder });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 530,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const editWorkOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const userId = req.body.userId;
    // const token =req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log("pofkdgopdfgk");
    let workOrder1 = await WorkOrder.find({
      workOrderId: req.body.workOrderId,
    });

    let workOrderLength = workOrder1.length;
    console.log(workOrderLength)
    workOrder1 = workOrder1[0];

    const workOrder = await WorkOrder.create({
      workOrderId: req.body.workOrderId,
      vendorId: workOrder1.vendorId,
      vendorName: workOrder1.vendorName,
      name: workOrder1.name,
      address: workOrder1.address,
      workOrderDate: workOrder1.workOrderDate,
      gstInNo: workOrder1.gstInNo,
      panNo: workOrder1.panNo,
      kindAttn: workOrder1.kindAttn,
      mobileNo: workOrder1.mobileNo,
      emailId: workOrder1.emailId,

      quotationDate: workOrder1.quotationDate,
      amend: workOrderLength,
      amendDate: new Date(),
      subject: req.body.subject,
      tableData: req.body.tableData,
      scopeOfWork: req.body.scopeOfWork,
      priceBasis: req.body.priceBasis,
      taxesAndDuties: req.body.taxesAndDuties,
      paymentTerms: req.body.paymentTerms,
      workCompletionSchedule: req.body.workCompletionSchedule,
      keyMaterialsProcurement: req.body.keyMaterialsProcurement,
      inspections: req.body.inspections,
      defectLiabilityPeriod: req.body.defectLiabilityPeriod,
      safetyRequirement: req.body.safetyRequirements,
      statutoryRequirement: req.body.statutoryRequirements,
      otherTermAndCondition: req.body.otherTermAndCondition,
      general: req.body.general,
      other: req.body.other,
      note: req.body.note,
      transportation: req.body.transportation,
      performanceAndTermination: req.body.performanceAndTermination,

      billingAddress: workOrder1.billingAddress,
      deliveryAddress: workOrder1.deliveryAddress,
      nameOfCompanyInAddress: workOrder1.nameOfCompanyInAddress,
      preparedBy:decode.name,
      projectId:workOrder1.projectId,
      projectName:workOrder1.projectName,
      // pdfOfWorkOrder: decodeURIComponent(`https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${req.file.key}`)
    }
    
    );
    //   IMP: remember to replace req.body.value as no value field in this schema
    console.log(workOrder);
    sendEmail("Work Order Approval",`${workOrder.workOrderId}--${workOrder.amend} is Prepared By ${workOrder.preparedBy} On ${getDate.getCurrentDate()} Please Approve.`, process.env.SUPER_ADMIN_EMAIL_ID)

    let message = `${decode.name} updated WorkOrder ${
      workOrder.workOrderId
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder Updated", data: workOrder });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 531,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const approveWorkOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // const token =req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log('came',req.body);
    const workOrderId = req.body.workOrderId;

    const updatedWorkOrder = await WorkOrder.findOneAndUpdate(
      { workOrderId: workOrderId },
      {$set:{ isApproved: true,
      approvedBy:decode.id,
      approvedOnDate:Date.now()
      }},
      
      { new: true } // Return the updated document
    );

    if (!updatedWorkOrder) {
      return res.status(404).json({ code: 404, message: "WorkOrder not found" });
    }
    console.log('value:',updateWorkOrder);
    let message = `${decode.name} approved WorkOrder ${
      workOrderId
    } on ${getDate.getCurrentDate()}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "WorkOrder Approved", data: updatedWorkOrder });
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
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

module.exports = {
  createWorkOrder,
  getAllWorkOrder,
  getWorkOrderById,
  updateWorkOrder,
  editWorkOrder,
  approveWorkOrder,
  getWorkOrderByProjectId,
};
