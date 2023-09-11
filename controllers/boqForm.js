const BOQForm = require("../models/boqForm.schema");
const Logs = require("../models/log.model");
const getDate = require('../middleware/getDate.js');

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BOQFormGPWise = require("../models/boqForm.GpsWise.schema");
const Inventory = require("../models/inventory.schema");
const { Product } = require("../Schemas/ProductSchema");
const Project = require("../models/project.schema");

const fs = require("fs");
const XLSX = require("xlsx");
const { default: axios } = require("axios");

// const createBoqForm = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const productCode = req.body.productCode;
//     const projectId = req.body.projectId;
//     const projectName = req.body.projectName;
//     const serviceOrSupply = req.body.serviceOrSupply;
//     const totalQuantity = req.body.totalQuantity;

//     const boqData1 = await BOQForm.findOne({
//       projectId: projectId,
//       productCode: productCode,
//     });
//     console.log(boqData1);
//     if (boqData1) {
//       return res.status(500).json({
//         code: 408,
//         error: "Please Contact to HeadOffice",
//         message: `${productCode} Already Exists In Boq`,
//       });
//     }

//     const boqData = await BOQForm.create({
//       productCode: productCode,
//       serviceOrSupply: serviceOrSupply,
//       projectId: projectId,
//       projectName: projectName,
//       totalQuantity: totalQuantity,
//       totalQuantityFromGps: 0,
//     });

//     return res
//       .status(200)
//       .json({ code: 200, message: "BOQ Form Object created", data: boqData });
//   } catch (error) {
//     console.log(error);
//     let message = req.body.userId+" "+error + " "+getDate.getCurrentDate();
//     await Logs.create({
//       logs: message,
//       userId: req.body.userId,
//     });

//     return res.status(500).json({
//       code: 409,
//       error: "Please Contact to HeadOffice",
//       message: "Internal Server Error",
//     });
//   }
// };

const createBoqFormGpWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    console.log(req.body);
    const productCode = req.body.productCode;
    const projectId = req.body.projectId;
    const gpId = req.body.gpId;
    const gpName = req.body.gpName;
    const tableData = req.body.tableData;
    const projectName = req.body.projectName;

    const boqDataGpWise = await BOQFormGPWise.findOne({
      projectId: projectId,
      gpId: gpId,
    });
    if (boqDataGpWise) {
      return res.status(200).json({
        message: "Already Generated Please Go To Update",
      });
    }

    console.log(tableData);
    const boqDataCreationPromises = [];
    const inventoryUpdatePromises = [];

    for (const product of tableData) {
      const {
        materialCategory,
        materialSubCategory,
        materialDescription,
        quantity,
        uom,
      } = product;

      // Create or update BOQFormGPWise entry
      boqDataCreationPromises.push(
        BOQFormGPWise.create({
          productCode: `${materialCategory}/${materialSubCategory}/${materialDescription}`,
          serviceOrSupply: product.serviceOrSupply || "Supply",
          projectId: projectId,
          gpId: gpId,
          gpName: gpName,
          projectName: projectName,
          quantity: parseInt(quantity),
          uom: uom,
        })
      );

      // Update or create BOQForm entry
      boqDataCreationPromises.push(
        BOQForm.findOneAndUpdate(
          {
            productCode: `${materialCategory}/${materialSubCategory}/${materialDescription}`,
            serviceOrSupply: "Supply",
            projectId: projectId,
            projectName: projectName,
          },
          {
            $inc: { totalQuantityFromGps: parseInt(quantity) },
          },
          { upsert: true }
        )
      );

      // Update Inventory entry
      inventoryUpdatePromises.push(
        Inventory.findOneAndUpdate(
          {
            projectId: projectId,
            gpId: gpId,
            materialCategory: materialCategory,
            materialSubCategory: materialSubCategory,
            materialDescription: materialDescription,
            uom: uom,
          },
          {
            $inc: { boqQty: parseInt(quantity) },
            materialCategory: materialCategory,
            materialSubCategory: materialSubCategory,
            materialDescription: materialDescription,
            gpId: gpId,
            gpName: gpName,
            projectId: projectId,
            projectName: projectName,
            uom: uom,
          },
          {
            upsert: true,
            new: true,
          }
        )
      );
    }

    // Execute all promises in parallel
    await Promise.all([...boqDataCreationPromises, ...inventoryUpdatePromises]);

    let message =decode.name + "created BoQ of " + gpName + " on " + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      message: "BOQ Form GP Wise Object created",
      // data: boqDataGpWise,
    });
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 409,
      error: "Please Contact HeadOffice",
      message: "BOQ creation Failed",
    });
  }
};

const gpHasABoq = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    console.log(req.body);

    let getGp = await BOQFormGPWise.findOne({
      projectId:req.body.projectId,
      gpId:req.body.gpId
    })

    if(getGp){
      let message = decode.name + " searched GP " + getGp.name + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res
        .status(200)
        .json({ code: 1001, message: "Already Have A Boq Please Go To Update "});
    }
    else{
      let message = decode.name + " searched non existing GP with id " + req.body.gpId + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res
        .status(200)
        .json({ code: 1002, message: "Not Exist" });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 411,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};
const updateBoqForm = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    console.log(req.body);

    // let boq = await BOQForm.findOne({
    //   projectId: req.body.projectId,
    //   productCode: req.body.productCode,
    // });

    // let total_quantity = boq.totalQuantityFromGps;

    // if (total_quantity > req.body.totalQuantity) {
    //   return res.status(500).json({
    //     code: 410,
    //     error: "Please Contact HeadOffice",
    //     message: "You Cannot Enter Value Less Than Sum Of Gp Amount",
    //   });
    // }

    // const updatedBoqData = await BOQForm.findByIdAndUpdate(
    //   boq._id, // Filter by _id
    //   {
    //     serviceOrSupply: "Supply",
    //     $set: { totalQuantity: parseInt(req.body.totalQuantity) },
    //   },
    //   {
    //     new: true, // Return the updated document
    //     select: {
    //       productCode: true,
    //       projectId: true,
    //       projectName: true,
    //       serviceOrSupply: true,
    //       totalQuantity: true,
    //     },
    //   }
    // );

    // if (!updatedBoqData) {
    //   return res.status(404).json({ code: 404, message: "BOQ Form not found" });
    // }
    let message = decode.name + " " + "tried to update Boq" + " on"+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, data: updatedBoqData, message: "You Can't Do Changes Here Please Change In Gp" });
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 411,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const updateBoqFormGpWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    console.log(req.body);
    let gpId = req.body.gpId
    let productCode = req.body.productCode
    let [materialCategory,materialSubCategory, materialDescription]= productCode.split('/')
    console.log(materialCategory,materialSubCategory,materialDescription)
    let quantity = parseInt(req.body.quantity);
    let boq = await BOQFormGPWise.findOne({
      projectId: req.body.projectId,
      productCode: req.body.productCode,
    });
    let boq_quantity = parseInt(boq.quantity);

    let boqMain = await BOQForm.findOne({
      projectId: req.body.projectId,
      productCode: req.body.productCode,
    });

    let total_quantity = parseInt(boqMain.totalQuantityFromGps);

    const updatedBoqData = await BOQFormGPWise.findByIdAndUpdate(
      boq._id, // Filter by _id
      {
        serviceOrSupply: "Supply",
        $set: { quantity: parseInt(quantity) },
      },
      {
        new: true, // Return the updated document
        select: {
          productCode: true,
          projectId: true,
          projectName: true,
          serviceOrSupply: true,
          quantity: true,
        },
      }
    );
    let boqMainUpdate = await BOQForm.findOneAndUpdate(
      { projectId: req.body.projectId, productCode: req.body.productCode },
      {
        $set: {
          totalQuantityFromGps: parseInt(
            boqMain.totalQuantityFromGps - boq_quantity + quantity
          ),
        },
      }
    );
    console.log(quantity)
    let inventoryBoqUpdate = await Inventory.findOneAndUpdate(
      { projectId: req.body.projectId, 
      gpId:gpId,
      materialCategory,
      materialSubCategory,
      materialDescription
      },
      {
        $set:{boqQty:parseInt(quantity)}
      }
    );
    

    if (!updatedBoqData) {
      return res.status(404).json({ code: 404, message: "BOQ Form not found" });
    }
    let message = decode.name+ " " + "successfully updated BOQ Form with productCode " + updatedBoqData.productCode + " on"+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({ code: 200, data: updatedBoqData, message: "BOQ Form updated" });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 411,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getAllBoqFormOfProjectWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // user specific, HO

    const projectId = req.body.selectedProjectId;
    console.log("this is our id", projectId);
    const boqFormData = await BOQForm.find({
      projectId: projectId,
    });
    let message = decode.name+ " " +"retrieved all BoqForm of project "+ req.body.projectName + " on"+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(200).json({
      code: 200,
      data: boqFormData,
      message: "BoqForms of the project retrieved",
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 412,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const getAllBoqFormOfGpWise = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // user specific, HO

    const projectId = req.body.selectedProjectId;
    const gpId = req.body.selectedGpId;
    console.log("this is our id", projectId, "dsd", gpId);
    const boqFormData = await BOQFormGPWise.find({
      projectId: projectId,
      gpId: gpId,
    });
    console.log(boqFormData);
    let message = decode.name+ " " +"retrieved all BoqForm of Gp "+ req.body.gpName + " on"+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res.status(200).json({
      code: 200,
      data: boqFormData,
      message: "BoqForms of the project retrieved",
    });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 412,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  // createBoqForm,
  updateBoqForm,
  getAllBoqFormOfProjectWise,
  getAllBoqFormOfGpWise,
  createBoqFormGpWise,
  updateBoqFormGpWise,
  gpHasABoq
};

