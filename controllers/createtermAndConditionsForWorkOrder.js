const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const workOrderTermsAndConditions = require("../models/workOrderTemplate.schema");

const createWorkOrderTermsAndCondition = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const workOrderTermsAndConditionTemplate = await workOrderTermsAndConditions.create({
        nameOfTemplate: req.body.selectedOptions.nameOfTemplate,
        scopeOfWork: req.body.selectedOptions.scopeOfWork,
        priceBasis: req.body.selectedOptions.priceBasis,
        taxesAndDuties: req.body.selectedOptions.taxesAndDuties,
        paymentTerms: req.body.selectedOptions.paymentTerms,
        workCompletionSchedule: req.body.selectedOptions.workCompSchedule,
        keyMaterialsProcurement: req.body.selectedOptions.keyMaterialsProcurement,
        inspections: req.body.selectedOptions.inspections,
        defectLiabilityPeriod: req.body.selectedOptions.defectLiabilityPeriod,
        safetyRequirements: req.body.selectedOptions.safetyRequirements,
        statutoryRequirements: req.body.selectedOptions.statutoryRequirements,
        // otherTAndC: req.body.otherTAndC,
        // general: req.body.general,
        other: req.body.selectedOptions.other,
        // note: req.body.note,
        performanceAndTermination: req.body.selectedOptions.performanceAndTermination,
        transportation: req.body.selectedOptions.transportation
      });
      let message = `${decode.name} created TermAndCondition Of WorkOrder with name ${workOrderTermsAndConditionTemplate.nameOfTemplate} on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Scope Of Work Created", data: workOrderTermsAndConditionTemplate });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 424,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  
const editWorkOrderTermsAndCondition = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const workOrderTermsAndConditionTemplate = await workOrderTermsAndConditions.findByIdAndUpdate(
        req.body.templateId
      ,
      {
        nameOfTemplate: req.body.selectedOptions.nameOfTemplate,
        scopeOfWork: req.body.selectedOptions.scopeOfWork,
        priceBasis: req.body.selectedOptions.priceBasis,
        taxesAndDuties: req.body.selectedOptions.taxesAndDuties,
        paymentTerms: req.body.selectedOptions.paymentTerms,
        workCompletionSchedule: req.body.selectedOptions.workCompletionSchedule,
        keyMaterialsProcurement: req.body.selectedOptions.keyMaterialsProcurement,
        inspections: req.body.selectedOptions.inspections,
        defectLiabilityPeriod: req.body.selectedOptions.defectLiabilityPeriod,
        safetyRequirements: req.body.selectedOptions.safetyRequirements,
        statutoryRequirements: req.body.selectedOptions.statutoryRequirements,
        // otherTAndC: req.body.otherTAndC,
        // general: req.body.general,
        other: req.body.selectedOptions.other,
        // note: req.body.note,
        performanceAndTermination: req.body.selectedOptions.performanceAndTermination,
        transportation: req.body.selectedOptions.transportation
      });
      let message = `${decode.name} update TermAndCondition Of WorkOrder with name ${workOrderTermsAndConditionTemplate.nameOfTemplate} on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Term And Condition Edited", data: workOrderTermsAndConditionTemplate });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 425,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createPriceBasis = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const priceBasis = await prisma.workOrderPriceBasis.create({
        data: {
          priceBasisId: uuidv4(),
          value: req.body.value,
            title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Price Basis ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Price Basis Created", data: priceBasis });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 426,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createTaxesAndDuties = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const taxesAndDuties = await prisma.workOrderTaxesAndDuties.create({
        data: {
          taxesAndDutiesId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Taxes And Duties ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Taxes And Duties Created", data: taxesAndDuties });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 427,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createPaymentTerms = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const paymentTerms = await prisma.workOrderPaymentTerms.create({
        data: {
          paymentTermsId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created PaymentTerms ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "PaymentTerms Created", data: paymentTerms });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 428,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createWorkCompSchedule = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const workCompSchedule = await prisma.workOrderWorkCompSchedule.create({
        data: {
          workCompScheduleId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created WorkCompSchedule ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "WorkCompSchedule Created", data: workCompSchedule });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 429,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  
  const createKMP = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const kMP = await prisma.workOrderKMP.create({
        data: {
          kMPId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created KMP ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "KMP Created", data: kMP });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 430,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createInspections = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const inspections = await prisma.workOrderInspections.create({
        data: {
          inspectionsId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Inspections ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Inspections Created", data: inspections });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 431,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createDLP = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const dLP = await prisma.workOrderDLP.create({
        data: {
          dLPId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created DLP ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "DLP Created", data: dLP });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 432,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createSafetyRequirements = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const safetyRequirements = await prisma.workOrderSafetyRequirements.create({
        data: {
          safetyRequirementsId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created SafetyRequirements ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "SafetyRequirements Created", data: safetyRequirements });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 433,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createStatutoryRequirements = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const statutoryRequirements = await prisma.workOrderStatutoryRequirements.create({
        data: {
          statutoryRequirementsId: uuidv4(),
          title:req.body.title,
          value: req.body.value,
          createdBy: userId
        },
      });
      let message = `${decode.name} created StatutoryRequirements ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "StatutoryRequirements Created", data: statutoryRequirements });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 434,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createOtherTAndC = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const otherTAndC = await prisma.workOrderOtherTAndC.create({
        data: {
          otherTAndCId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created OtherTAndC ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "OtherTAndC Created", data: otherTAndC });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 435,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createGeneral = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const general = await prisma.workOrderGeneral.create({
        data: {
          generalId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created General ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "General Created", data: general });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 436,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createOther = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const other = await prisma.workOrderOther.create({
        data: {
          otherId: uuidv4(),
          title:req.body.title,
          value: req.body.value,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Other ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Other Created", data: other });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 437,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createNote = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const note = await prisma.workOrderNote.create({
        data: {
          noteId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Note ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Note Created", data: note });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 438,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const createTransportation = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const note = await prisma.workOrderTransport.create({
        data: {
          transportationId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created Transportation ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "Transportation Created", data: note });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 439,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };
  const createPerformanceAndTermination = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const userId = req.body.userId;
      console.log(req.body);
      const PerformanceAndTermination = await prisma.workOrderPerformanceAndTermination.create({
        data: {
          performanceId: uuidv4(),
          value: req.body.value,
          title:req.body.title,
          createdBy: userId
        },
      });
      let message = `${decode.name} created PerformanceAndTermination ${
        req.body.value
      } on ${getDate.getCurrentDate()}`;
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res
        .status(200)
        .json({ code: 200, message: "PerformanceAndTermination Created", data: PerformanceAndTermination });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 440,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  module.exports = {
    createPriceBasis,
    createTaxesAndDuties,
    createPaymentTerms,
    createWorkCompSchedule,
    createKMP,
    createInspections,
    createDLP,
    createSafetyRequirements,
    createStatutoryRequirements,
    createOtherTAndC,
    createGeneral,
    createOther,
    createNote,
    createTransportation,
    createPerformanceAndTermination,
    createWorkOrderTermsAndCondition,
    editWorkOrderTermsAndCondition
  };