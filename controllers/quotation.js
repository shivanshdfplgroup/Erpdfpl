const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');
const Quotation = require("../models/quotation.schema.js")
const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const createQuotation = async (req, res) => {
  console.log(req.body);
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  try {
    // *******************************************IMP: please get a modal "IdGeneration" and import in the file
  let projectCode = req.body.projectCode
  const sequenceVal = await Quotation.find({projectId:req.body.projectId}).count();
    const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
    const uniqueId = `CIPL/${projectCode}/Quotation/23-24/${paddedSequenceVal}`;
    // Create a new document in the 'idGeneration' collection
    // await IdGeneration.create({ uniqueId });

    const tableData = req.body.tableData;
    console.log(tableData)
    // Function to create a new quotation for each row in the table data
    const createQuotations = async () => {
      const quotations = [];
      // const oldEntry = await Quotation.find({
      //   projectId: req.body.projectId,
      //   vendorId: req.body.vendorId,
      //   prId: req.body.prId,
      // });

      // if (oldEntry.length > 0) {
      //   throw Error("Already Exists With This Vendor And This PR");
      // }

      for (const rowData of tableData) {
        let materialCode = `${rowData.materialCategory}/${rowData.materialSubCategory}/${rowData.materialDescription}`;

        const newEntry = await Quotation.create({
          id: uuidv4(),
          quotationId: uniqueId,
          projectId: req.body.projectId,
          projectName: req.body.projectName,
          vendorId: req.body.vendorId,
          prId: req.body.prId,
          vendorName: req.body.vendorName,
          materialCategory: rowData.materialCategory,
          materialSubCategory: rowData.materialSubCategory,
          materialDescription: rowData.materialDescription,
          materialCode: materialCode,
          uom: rowData.uom,
          quantity: parseInt(rowData.quantity_balance),
          rate: parseFloat(rowData.rate),
          amount: parseFloat(rowData.amount),
          gst: rowData.gst,
          gstAmount: parseFloat(rowData.gstAmount),
          remark: rowData.remark,
        });

        quotations.push(newEntry);
      }

      return quotations;
    };

    // Call the function to create quotations for each row in the table data
    const createdQuotations = await createQuotations();
    let message = decode.name+ " " +"created Quotation Entry with quotationId: "+ uniqueId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      message: "Quotation Entry Created",
      data: createdQuotations,
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 494,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getAllQuotationOfProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // user specific, HO
      // a project has multiple pr and each pr has quotations
      // pass prId
    const prId = req.body.prId;
   

    // 1) Add name to schema.prisma 
      // 2) name=materialCategory+materialSubCategory+materialDescription
      // 3) create dummy array of objects witg all values including name 
      // 4) Create a map{key, value}, where key=name(point 2) and value=(array of objects with name = key)
      // 5) return this map
      // dummy data
    


    const quotations = await Quotation.find({
      prId:prId
    });

    // console.log(quotations)
    function createMapWithSameNameObjects(quotations) {
      const mapByName = new Map();

      quotations.forEach((quotation) => {
        const name = quotation.materialCode;

        if (mapByName.has(name)) {
          mapByName.get(name).push(quotation);
        } else {
          mapByName.set(name, [quotation]);
        }
      });

      return mapByName;
    }

    const mymap = createMapWithSameNameObjects(quotations);
    const mymapArray = Array.from(mymap, ([name, quotations]) => ({ name, quotations }));
    let message = decode.name+ " " +"retrieved All quotations of a respective PR with prId: "+prId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res.status(200).json({
      code: 200,
      data: mymapArray,
      projectName: quotations[0].projectName,
      projectId: quotations[0].projectId,
      message: "All quotations of a respective PR are retrieved",
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 495,
      error: "Please Contact HeadOffice",
      message: error,
    });
  }
};



const getQuotationWithPr = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{

      // user specific, HO
      // pass projectId
      
     

      // 1) Add name to schema.prisma 
      // 2) name=materialCategory+materialSubCategory+materialDescription
      // 3) create dummy array of objects witg all values including name 
      // 4) Create a map{key, value}, where key=name(point 2) and value=(array of objects with name = key)
      // 5) return this map
      // dummy data

     let quotations = await Quotation.find();
     console.log(quotations)
     let message = decode.name+ " " +"retrieved all quotations" + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

     return res.status(200).json({code: 200, data: quotations, message: "all quotations admin are retrieved"});

    }
    catch (error){
      console.log(error)
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 496, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
    }
  }

  const getQuotationById = async (req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      let quotations = await Quotation.find({
        quotationId: req.body.quotationId,
      });
  
      const quotationMap = {};
  
      // Loop through the array of quotations and organize them based on quotationId
      quotations.forEach((quotation) => {
        const quotationId = quotation.quotationId;
        if (!quotationMap[quotationId]) {
          quotationMap[quotationId] = {
            vendorName: quotation.vendorName,
            prId: quotation.prId,
            quotationId: quotation.quotationId,
            projectName: quotation.projectName,
            tableData: [],
          };
        }
        quotationMap[quotationId].tableData.push({
          materialCategory: quotation.materialCategory,
          materialSubCategory: quotation.materialSubCategory,
          materialDescription: quotation.materialDescription,
          quantity: quotation.quantity,
          uom: quotation.uom,
          rate: quotation.rate,
          amount: quotation.amount,
          gst: quotation.gst,
          gstAmount: quotation.gstAmount,
          remark: quotation.remark,
        });
      });
  
      const quotationCollection = Object.values(quotationMap);
      let message = decode.name+ " " +"retrieved Quotation with quotationId: " +req.body.quotationId+ " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res.status(200).json({
        code: 200,
        data: quotationCollection,
        message: "All quotations admin are retrieved",
      });
    } catch (error) {
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 497,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };



module.exports = {
  createQuotation,getAllQuotationOfProject,
  getQuotationWithPr, getQuotationById
};
