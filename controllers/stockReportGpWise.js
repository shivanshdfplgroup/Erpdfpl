const { Product } = require("../Schemas/ProductSchema");
const Logs = require("../models/log.model");
const MaterialIssueNote = require("../models/materialIssueNote.schema");
const MRN = require("../models/mrn.schema");
const getDate = require('../middleware/getDate.js');
const jwt = require("jsonwebtoken");


const getAllFullMINForStockGpWise = async (req, res) => {
  // const token = req.headers.authorization;
  // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

  // -> HO

  const projectId = req.body.projectId;
  const gpName = req.body.gpName;
  let itemSelected = req.body.itemSelected;

  let materialCategory = itemSelected.materialCategory;
  let materialSubCategory = itemSelected.materialSubCategory;
  let materialDescription = itemSelected.materialDescription;

  let data = []; // Initialize the 'data' array

  try {
    const newEntry = await MaterialIssueNote.find({
      projectId:projectId,
      gp:gpName
    });

    for (const mins of newEntry) {
      console.log(mins.tableData);
      mins.tableData.forEach((min) => {
        let currentMaterialCategory = min.materialCategory;
        let currentMaterialSubCategory = min.materialSubCategory;
        let currentMaterialDescription = min.materialDescription;

        // Check if the current item matches the specified criteria
        if (
          currentMaterialCategory === materialCategory &&
          currentMaterialSubCategory === materialSubCategory &&
          currentMaterialDescription === materialDescription
        ) {
          // Extract other fields
          let quantity_requested = min.quantity_requested;
          let quantity_issued = min.quantity_issued;
          let uom = min.uom;
          let vendorName = mins.vendor;
          let gpName = mins.gp;
          let minId = mins.minId;

          // Push extracted data into the 'data' array
          data.push({
            materialCategory: currentMaterialCategory,
            materialSubCategory: currentMaterialSubCategory,
            materialDescription: currentMaterialDescription,
            quantity_requested,
            quantity_issued,
            uom,
            vendorName,
            gpName,
            minId,
          });
        }
      });
    }

    // Now 'data' array contains the filtered data
    // You can use 'data' for further processing or return it as needed
    let message = decode.name+ " " +"retrieved Material Issue Note entries for Gp: " +gpName+ " "+getDate.getCurrentDate();
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



module.exports = {
  getAllFullMINForStockGpWise
};
