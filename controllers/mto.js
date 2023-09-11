const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const MTO = require('../models/mto.model');
const Project = require('../models/project.schema.js');
const Inventory = require('../models/inventory.schema.js');

const createMtoEntry = async(req, res) => {

  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log('data recieved:',req.body);
    try{  
      // let project = await Project.findOne({id:req.body.projectId})
      const sequenceVal = await MTO.find({projectId:req.body.projectSelected.id}).count();
      const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
      const uniqueId = `CIPL/MTO/23-24/${paddedSequenceVal}`;

        // const mtoId = uuidv4();
        const mtoId = uniqueId;
        const userId = decode.id;
        // const mtoNumber = req.body.mtoNumber //have mrnNumber for reference
        const mtoDate = req.body.mtoDate
        // const mrnDate = req.body.mrnDate
        // const mtoDescription = req.body.mtoDescription
        // const mtoUom = req.body.mtoUom
        // const mtoQuantity = req.body.mtoQuantity
        // const mtoRate = req.body.mtoRate
        // const mtoAmount = req.body.mtoAmount
        const mtoContractorName = req.body.selectedVendor.name
        // const mtoGpName = req.body.mtoGpName
        const remark = req.body.remark
        // const projectId = req.body.projectId
        const projectDetails = req.body.projectSelected
        const transferFromGpName=req.body.transferFromGp.name
        const transferToGpName=req.body.transferToGp.name
        // console.log('we got', req.body);
        const tableData = req.body.tableData
        // first check
        let isPossible = true;
        for (const rowData of tableData) {
          console.log('row', rowData, transferFromGpName,transferToGpName);
          const inventoryItemFrom = await Inventory.findOne({
            projectId: projectDetails.id,
            gpName:transferFromGpName,
            materialCategory: rowData.materialCategory,
            materialSubCategory: rowData.materialSubCategory,
            materialDescription: rowData.materialDescription,
          });
          const inventoryItemTo = await Inventory.findOne({
            projectId: projectDetails.id,
            gpName:transferToGpName,
            materialCategory: rowData.materialCategory,
            materialSubCategory: rowData.materialSubCategory,
            materialDescription: rowData.materialDescription,
          });
          if(inventoryItemFrom==null||inventoryItemTo==null){
            isPossible=false;
            break;
          }
          try{
            console.log('InventoryFROM Gp', inventoryItemFrom);
            console.log('Inventory TO', inventoryItemTo);
            // from gp has enough qty to send and to gp has capacity to store
            let reqd=parseInt(rowData.quantity)
            console.log('reqd',reqd);
            if((inventoryItemFrom.recievedQty>=reqd)&&(inventoryItemTo.recievedQty+reqd<=inventoryItemTo.boqQty)){
              console.log('we can do for row: ', rowData.sNo);
            } else{
              isPossible=false;
              break;
            }
          } catch (error) {
            console.error(error.message);
            // hasError = true; // Set the flag to true if an error occurs
            break; // Break out of the loop as we don't need to process further updates
          }
        }
        if(isPossible){
          // we will update inventory for each row
          // i.e : inventoryItemFrom.recievedQty-reqd
          //       inventoryItemTo.recievedQty + reqd
          console.log('we can create mto');
          for (const rowData of tableData) {
            // console.log('row', rowData, transferFromGpName,transferToGpName);
            try{
              // console.log('InventoryFROM Gp', inventoryItemFrom);
              // console.log('Inventory TO', inventoryItemTo);
              // from gp has enough qty to send and to gp has capacity to store
              let reqd=parseInt(rowData.quantity);
            const inventoryItemFromUpdated = await Inventory.findOneAndUpdate(
              {
                projectId: projectDetails.id,
                gpName: transferFromGpName,
                materialCategory: rowData.materialCategory,
                materialSubCategory: rowData.materialSubCategory,
                materialDescription: rowData.materialDescription,
              },
              {
                $inc: { recievedQty: -reqd }, // Decrement recievedQty by reqd
              },
              { new: true }
            );
            const inventoryItemToUpdated = await Inventory.findOneAndUpdate(
              {
                projectId: projectDetails.id,
                gpName: transferToGpName,
                materialCategory: rowData.materialCategory,
                materialSubCategory: rowData.materialSubCategory,
                materialDescription: rowData.materialDescription,
              },
              {
                $inc: { recievedQty: reqd }, // Increment recievedQty by reqd
              },
              { new: true }
            );
            console.log(rowData.sNo, inventoryItemFromUpdated, inventoryItemToUpdated);
            } catch (error) {
              console.error(error.message);
              // hasError = true; // Set the flag to true if an error occurs
              break; // Break out of the loop as we don't need to process further updates
            }
          }
          // now let's create MTO entry
          const newEntry = await MTO.create({
           
            mtoId: mtoId,
            userId:userId, // may be project ID in future
            // mtoNumber : mtoNumber,
            mtoDate : new Date(mtoDate),
            // mrnDate: new Date(mrnDate),
            tableData: tableData,
            // mtoDescription : mtoDescription,
            // mtoUom : mtoUom,
            // mtoQuantity : parseInt(mtoQuantity),
            // mtoRate : parseInt(mtoRate),
            // mtoAmount : parseInt(mtoAmount),
            mtoContractorName : mtoContractorName,
            // mtoGpName : mtoGpName,
            transferFromGpName: transferFromGpName,
            transferToGpName: transferToGpName,
            projectName: projectDetails.name,
            projectId: projectDetails.id,
            remark : remark
    });
    let message = decode.name+ " " +"created MTO entry with mtoId: "+uniqueId + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    console.log('we created mto', newEntry);
    return res.status(200).json({ code: 200, message: "entry created", data: newEntry })
        } else{
          return res.status(404).json({
            code: 323, error: "Please Contact HeadOffice" , message: "Not Possible to create"
          })
        }
    }catch(error){
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 474, error: "Please Contact HeadOffice" , message: "Internal Server Error"
        })
    }
}

const getMTO = async(req, res) => {

    req.query.token=req.headers.authorization;
    const token = req.query.token;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    console.log(req.body)

    try{  
    
        const newEntry = await MTO.find({ userId:decode.id })
        let message = decode.name+ " " +"retrieved all MTO entries" + " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
        console.log('we have', newEntry);
        return res.status(200).json({ code: 200, message: "entry created", data: newEntry })

    }catch(error){
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 475, error: "Please Contact HeadOffice" , message: "Internal Server Error"
        })
    }
}

const getMTOProjectWise = async(req, res) => {

  req.query.token=req.headers.authorization;
  const token = req.query.token;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  console.log(req.body)

  try{  
  
      const newEntry = await MTO.find({ projectId: req.body.projectId })
      let message = decode.name+ " " +"retrieved all MTO entries for a project"+  + " on "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      console.log('we got', newEntry);
      return res.status(200).json({ code: 200, message: "retrived for project", data: newEntry })

  }catch(error){
      console.log(error);
      let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 475, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
  }
}

module.exports = {
    createMtoEntry, getMTO, getMTOProjectWise
}