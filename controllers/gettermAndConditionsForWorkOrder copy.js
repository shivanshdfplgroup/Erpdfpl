const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const workOrderTermsAndConditions = require("../models/workOrderTemplate.schema");

const getScopeOfWork = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const scopeOfWork = await prisma.workOrderScopeOfWork.findMany({
        select: {
          scopeOfWorkId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all ScopeOfWork values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "ScopeOfWork Fetched", data: scopeOfWork });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 452,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
const getTermAndConditionTemplate = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      console.log(req.body.templateId)
      const templateRules = await workOrderTermsAndConditions.findById(req.body.templateId);
      // const templateRules = await workOrderTermsAndConditions.find();
  
      let message = `${decode.name} wants all ${templateRules} values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Template Fetched", data: templateRules });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 453,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
const getAllTermAndConditionTemplate = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const templateRules = await workOrderTermsAndConditions.find();
      const templateArray = templateRules.map(template => ({
        _id: template._id,
        name: template.nameOfTemplate
      }));
      let message = `${decode.name} wants all templateRules values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Template Fetched", data: templateArray });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 454,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getPriceBasis = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const priceBasis = await prisma.workOrderPriceBasis.findMany({
        select: {
          priceBasisId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all PriceBasis values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "PriceBasis Fetched", data: priceBasis });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 455,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getTaxesAndDuties = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const taxesAndDuties = await prisma.workOrderTaxesAndDuties.findMany({
        select: {
          taxesAndDutiesId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all TaxesAndDuties values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "TaxesAndDuties Fetched", data: taxesAndDuties });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 456,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getPaymentTerms = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const paymentTerms = await prisma.workOrderPaymentTerms.findMany({
        select: {
          paymentTermsId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all PaymentTerms values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "PaymentTerms Fetched", data: paymentTerms });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 457,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getWorkCompSchedule = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const workCompSchedule = await prisma.workOrderWorkCompSchedule.findMany({
        select: {
          workCompScheduleId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all WorkCompSchedule values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "WorkCompSchedule Fetched", data: workCompSchedule });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 458,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getKMP = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const kMP = await prisma.workOrderKMP.findMany({
        select: {
          kMPId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all KMP values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "KMP Fetched", data: kMP });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 459,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getInspections = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const inspections = await prisma.workOrderInspections.findMany({
        select: {
          inspectionsId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all Inspections values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Inspections Fetched", data: inspections });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 460,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getDLP = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const dLP = await prisma.workOrderDLP.findMany({
        select: {
          dLPId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all DLP values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "DLP Fetched", data: dLP });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 461,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getSafetyRequirements = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const safetyRequirements = await prisma.workOrderSafetyRequirements.findMany({
        select: {
          safetyRequirementsId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all SafetyRequirements values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "SafetyRequirements Fetched", data: safetyRequirements });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 462,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getStatutoryRequirements = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const statutoryRequirements = await prisma.workOrderStatutoryRequirements.findMany({
        select: {
          statutoryRequirementsId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all StatutoryRequirements values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "StatutoryRequirements Fetched", data: statutoryRequirements });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 463,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getOtherTAndC = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const otherTAndC = await prisma.workOrderOtherTAndC.findMany({
        select: {
          otherTAndCId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all OtherTAndC values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "OtherTAndC Fetched", data: otherTAndC });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 464,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getGeneral = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const general = await prisma.workOrderGeneral.findMany({
        select: {
          generalId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all General values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "General Fetched", data: general });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 465,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getOther = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const other = await prisma.workOrderOther.findMany({
        select: {
          otherId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all Other values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Other Fetched", data: other });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 466,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const getNote = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const note = await prisma.workOrderNote.findMany({
        select: {
          noteId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });
  
      let message = `${decode.name} wants all Note values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Note Fetched", data: note });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 467,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  const getTransportation = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const note = await prisma.workOrderTransport.findMany({
        select: {
          transportationId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });

      let message = `${decode.name} wants all Transportation values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Transportation Fetched", data: note });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 468,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  const getPerformanceAndTermination = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
  
      const note = await prisma.workOrderPerformanceAndTermination.findMany({
        select: {
          performanceId: true,
          value: true,
          createdBy: true,
          createdAt: true,
          title:true
        },
      });

      let message = `${decode.name} wants all PerformanceAndTermination values on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "PerformanceAndTermination Fetched", data: note });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 469,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  module.exports = {
    getScopeOfWork,
    getPriceBasis,
    getTaxesAndDuties,
    getPaymentTerms,
    getWorkCompSchedule,
    getKMP,
    getInspections,
    getDLP,
    getSafetyRequirements,
    getStatutoryRequirements,
    getOtherTAndC,
    getGeneral,
    getOther,
    getNote,
    getTransportation,
    getPerformanceAndTermination,
    getTermAndConditionTemplate,
    getAllTermAndConditionTemplate
  };