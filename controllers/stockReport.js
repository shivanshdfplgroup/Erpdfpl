const { Product } = require("../Schemas/ProductSchema");
const Logs = require("../models/log.model");
const MaterialIssueNote = require("../models/materialIssueNote.schema");
const MRN = require("../models/mrn.schema");
const getDate = require('../middleware/getDate.js');
const jwt = require("jsonwebtoken");

const getMrnRelatedToStock = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const projectId = req.body.projectId;
    let itemSelected = req.body.itemSelected;

    let materialCategory = itemSelected.materialCategory;
    let materialSubCategory = itemSelected.materialSubCategory;
    let materialDescription = itemSelected.materialDescription;

    console.log(materialCategory, materialSubCategory, materialDescription);

    const mrnArrived = await MRN.find({
      projectId: projectId,
      materialCategory: materialCategory,
      materialSubCategory: materialSubCategory,
      materialDescription: materialDescription,
    });
    let message = decode.name+ " " +"retrieved MRN related to "+materialCategory+"/"+materialSubCategory+"/"+materialDescription + " on "+getDate.getCurrentDate();
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
      code: 509,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getAllFullMINForStock = async (req, res) => {
  // const token = req.headers.authorization;
  // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  // -> HO

  const projectId = req.body.projectId;
  let itemSelected = req.body.itemSelected;

  let materialCategory = itemSelected.materialCategory;
  let materialSubCategory = itemSelected.materialSubCategory;
  let materialDescription = itemSelected.materialDescription;

  let data = []; // Initialize the 'data' array

  try {
    const newEntry = await MaterialIssueNote.find({
      projectId: req.body.projectId,
    });

    for (const mins of newEntry) {
     
        if (
          materialCategory === mins.materialCategory &&
          materialSubCategory === mins.materialSubCategory &&
          materialDescription === mins.materialDescription
        ) {
          // Extract other fields
          let quantity_requested = mins.indentQuantity;
          let quantity_issued = mins.issuedQuantity;
          let uom = mins.uom;
          let vendorName = mins.vendor;
          let gpName = mins.gp;
          let minId = mins.minId;

          // Push extracted data into the 'data' array
          data.push({
            materialCategory: materialCategory,
            materialSubCategory: materialSubCategory,
            materialDescription: materialDescription,
            quantity_requested,
            quantity_issued,
            uom,
            vendorName,
            gpName,
            minId,
          });
        }
      }
    
    // Now 'data' array contains the filtered data
    // You can use 'data' for further processing or return it as needed
    let message = decode.name+ " " +"retrieved Material Issue Notes entries related to "+materialCategory+"/"+materialSubCategory+"/"+materialDescription + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({ code: 200, message: "Material Issue Note entries ", data: data });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 510,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};


const getMrnQuantityForAllProduct = async (req, res) => {
  const token = req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  console.log("here");

  try {
    const projectId = req.body.projectId;
    // Fetch all products with populated categories and subcategories
    const allProducts = await Product.find()
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });

    // Define a function to fetch MRN and MIN data for a product
    async function fetchDataForProduct(product) {
      const {
        category,
        subcategory,
        name: materialDescription,
        uom,
      } = product;

      // Fetch MRN data for the current product
      const mrnArrived = await MRN.find({
        projectId,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
      });
      const minArrived = await MaterialIssueNote.find({
        projectId,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
      });
     
      const mrnQuantity = mrnArrived.reduce((total, mrn) => total + parseInt(mrn.mrnQuantity), 0);
      let mrnRate = mrnArrived.reduce((total, mrn) => total + parseFloat(mrn.mrnRate ? mrn.mrnRate : 0), 0);
      mrnRate = parseFloat((mrnRate / mrnArrived.length).toFixed(2));

      // Filter Material Issue Notes for the current product

      const minQuantity = minArrived.reduce((total, min) => total + parseInt(min.issuedQuantity), 0);

      return {
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
        mrnQuantity,
        issuedQuantity: minQuantity,
        uom,
        rate: mrnRate,
        vendorName: mrnArrived.length > 0 ? mrnArrived[0]._doc.vendorName : "-",
        isSelected: true,
      };
    }

    // Use Promise.all to fetch data for all products concurrently
    const finalArray = await Promise.all(allProducts.map(fetchDataForProduct));

    let message = decode.name + " " + "retrieved MrnQuantityForAllProduct" + " on " + getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({ message: "success", code: 200, data: finalArray });
  } catch (error) {
    console.error(error);
    let message = decode.name + " " + error + " " + getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 511,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};


// vendor+projectId
const getMrnQuantityForAllProductForVendorWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  console.log("here")
  try {
    // const projectId = req.body.projectId;
    const vendorName = req.body.vendorName;
    // Fetch all products with populated categories and subcategories
    const allProducts = await Product.find()
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });

    // Fetch all Material Issue Notes for the given project


    const finalArray = [];

    for (const itemSelected of allProducts) {
      const {
        category,
        subcategory,
        name: materialDescription,
        uom,
      } = itemSelected;
      console.log(category.name, subcategory.name , materialDescription)
      // Filter Material Issue Notes for the current product
      const newEntry = await MaterialIssueNote.find({
        projectId:req.body.projectId,
        vendor:vendorName,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
      });


      const minQuantity = newEntry.reduce((total, min) => total + parseInt(min.issuedQuantity), 0);


      // Fetch MRN data for the current product
      const mrnArrived = await MRN.find({
        // projectId,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
        vendorName:vendorName
      });

      
      const mrnQuantity = mrnArrived.reduce((total, mrn) => total + parseInt(mrn.mrnQuantity), 0);
      console.log(mrnQuantity)
      if (mrnQuantity !== 0 || minQuantity !== 0) {
        finalArray.push({
          materialCategory: category.name,
          materialSubCategory: subcategory.name,
          materialDescription,
          mrnQuantity,
          issuedQuantity: minQuantity, // Added issued quantity
          uom,
          isSelected: true,
        });
      }
    }
    let message = decode.name+ " " +"retrieved MrnQuantityForAllProduct for vendor: "+ vendorName + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({ message: "success", code: 200, data: finalArray });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 512,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
// indent to be recommended is to DPM, whenever to be approved -> PM => both logs to DPM


// vendor+projectId+gpName
const getMrnQuantityForAllProductForVendorGpWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  console.log("here")
  try {
    // const projectId = req.body.projectId;
    // Fetch all products with populated categories and subcategories
    const allProducts = await Product.find()
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });

    // Fetch all Material Issue Notes for the given project
   


    const finalArray = [];

    for (const itemSelected of allProducts) {
      const {
        category,
        subcategory,
        name: materialDescription,
        uom,
      } = itemSelected;
      console.log(category.name, subcategory.name , materialDescription)
      // Filter Material Issue Notes for the current product
      const newEntry = await MaterialIssueNote.find({
        projectId:req.body.projectId,
        gp:req.body.gpName,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
      });


      const minQuantity = newEntry.reduce((total, min) => total + parseInt(min.issuedQuantity), 0);


      // Fetch MRN data for the current product
      const mrnArrived = await MRN.find({
        // projectId,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
        vendorName:req.body.vendorName
      });

      
      const mrnQuantity = mrnArrived.reduce((total, mrn) => total + parseInt(mrn.mrnQuantity), 0);
      console.log(mrnQuantity)
      if (mrnQuantity !== 0 || minQuantity !== 0) {
        finalArray.push({
          materialCategory: category.name,
          materialSubCategory: subcategory.name,
          materialDescription,
          mrnQuantity,
          issuedQuantity: minQuantity, // Added issued quantity
          uom,
          isSelected: true,
        });
      }
    }
    let message = decode.name+ " " +"retrieved MrnQuantityForAllProduct for Gp: "+ req.body.gpName + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({ message: "success", code: 200, data: finalArray });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 512,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};


const getStockReportGpWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  console.log("here")
  try {
    const projectId = req.body.projectId;
    console.log(projectId)
    // Fetch all products with populated categories and subcategories
    const allProducts = await Product.find()
      .populate({ path: "category", model: "Category" })
      .populate({ path: "subcategory", model: "Subcategory" });

    // Fetch all Material Issue Notes for the given project


    const finalArray = [];

    for (const itemSelected of allProducts) {
      const {
        category,
        subcategory,
        name: materialDescription,
        uom,
      } = itemSelected;
      console.log(category.name, subcategory.name , materialDescription)
      // Filter Material Issue Notes for the current product
      const minArriveds = await MaterialIssueNote.find({
        projectId,
        gp:req.body.gpName,
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
      });

      
      const minArrived = minArriveds.reduce((total, min) => total + parseInt(min.issuedQuantity), 0);


      // Fetch MRN data for the current product
    
      finalArray.push({
        materialCategory: category.name,
        materialSubCategory: subcategory.name,
        materialDescription,
        issuedQuantity: minArrived, // Added issued quantity
        uom,
        isSelected: true,
      });
    }
    let message = decode.name+ " " +"retrieved StockReport for Gp: "+ req.body.gpName + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({ message: "success", code: 200, data: finalArray });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 511,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  getAllFullMINForStock,
  getMrnRelatedToStock,
  getMrnQuantityForAllProduct,
  getMrnQuantityForAllProductForVendorWise,
  getMrnQuantityForAllProductForVendorGpWise,
  getStockReportGpWise
};
