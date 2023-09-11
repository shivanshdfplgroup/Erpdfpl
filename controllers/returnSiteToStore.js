const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ReturnSiteToStoreFormData = require('../models/returnSiteToStoreFromData.schema.js');
const Inventory = require("../models/inventory.schema.js");
const ProjectStock = require("../models/projectstock.schema.js");

const createReturnSiteToStore = async(req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try{
        const sequenceVal = await ReturnSiteToStoreFormData.countDocuments();
        const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
        const uniqueId = `CIPL/ReturnSiteToStoreFormData/23-24/${paddedSequenceVal}`;
      

        // const returnSiteToStoreId = uniqueId;
        // const returnSiteToStoreNumber = req.body.returnSiteToStoreNumber
        // const returnSiteToStoreDate = req.body.returnSiteToStoreDate
        // const poNumber = req.body.poNumber
        // const materialMainGroup = req.body.materialMainGroup
        // const materialSubGroup = req.body.materialSubGroup
        // const itemDescription = req.body.itemDescription
        // // const poQuantity  = req.body.poQuantity
        // const balanceReturnSiteToStore  = req.body.balanceReturnSiteToStore
        // const vendorName  = req.body.vendorName
        // const invoiceNumber  = req.body.invoiceDate
        // const invoiceDate  = req.body.invoiceDate
        // const transporterName  = req.body.transporterName
        // const grDate  = req.body.grDate
        // const grDocumentFileKey = req.body.grDocumentFileKey
        // const vehicleNumber  = req.body.vehicleNumber
        // const ewayBillNumber   = req.body.ewayBillNumber
        // const storageLocation  = req.body.storageLocation

        // const returnSiteToStoreUom = req.body.returnSiteToStoreUom
        // const returnSiteToStoreQuantity = req.body.returnSiteToStoreQuantity
        // const returnSiteToStoreRate = req.body.returnSiteToStoreRate
        // const returnSiteToStoreAmount = req.body.returnSiteToStoreAmount
        // const returnSiteToStoreContractorName = req.body.returnSiteToStoreContractorName
        // const returnSiteToStoreGpName = req.body.returnSiteToStoreGpName
        // const remark = req.body.remark
        const projectId = req.body.projectId
        const gpName = req.body.gpName
        const tableData = req.body.tableData

        console.log(projectId, gpName, tableData)
        // first check
        let isPossible = true;
        for (const rowData of tableData) {
          const inventoryItemFrom = await Inventory.findOne({
            projectId,
            gpName,
            materialCategory: rowData.materialCategory,
            materialSubCategory: rowData.materialSubCategory,
            materialDescription: rowData.materialDescription,
          });
          const StockItem = await ProjectStock.findOne({
            projectId: projectId,
            materialCategory: rowData.materialCategory,
            materialSubCategory: rowData.materialSubCategory,
            materialDescription: rowData.materialDescription,
          });
          console.log(inventoryItemFrom, StockItem)
          if(inventoryItemFrom==null||StockItem==null){
            isPossible=false;
            break;
          }
          try{
            // from gp has enough qty to send and to gp has capacity to store
            let reqd=parseInt(rowData.quantity)
            console.log('reqd',reqd);
            if((inventoryItemFrom.recievedQty>=reqd)){
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
            console.log('we can create returnToStore entry');
            for (const rowData of tableData) {
              // console.log('row', rowData, transferFromGpName,transferToGpName);
              try{
                // console.log('InventoryFROM Gp', inventoryItemFrom);
                // console.log('Inventory TO', inventoryItemTo);
                // from gp has enough qty to send and to gp has capacity to store
                let reqd=parseInt(rowData.quantity);
              const inventoryItemFromUpdated = await Inventory.findOneAndUpdate(
                {
                  projectId,
                  gpName,
                  materialCategory: rowData.materialCategory,
                  materialSubCategory: rowData.materialSubCategory,
                  materialDescription: rowData.materialDescription,
                },
                {
                  $inc: { recievedQty: -reqd }, // Decrement recievedQty by reqd
                },
                { new: true }
              );
              const StockItemToUpdated = await ProjectStock.findOneAndUpdate(
                {
                  projectId,
                  materialCategory: rowData.materialCategory,
                  materialSubCategory: rowData.materialSubCategory,
                  materialDescription: rowData.materialDescription,
                },
                {
                  $inc: { units: reqd }, // Increment units by reqd
                },
                { new: true }
              );
              console.log(rowData.sNo, inventoryItemFromUpdated, StockItemToUpdated);
              } catch (error) {
                console.error(error.message);
                // hasError = true; // Set the flag to true if an error occurs
                break; // Break out of the loop as we don't need to process further updates
              }
            }
        
        let message = decode.name+ " " +`created return Site To Store Form entry` +" on "+getDate.getCurrentDate();
        console.log(message);
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })

        return res.status(200).json({code: 200, message: "return Site To Store Form form entry created", data: newEntry})
        } else{
                return res.status(404).json({
                  code: 323, error: "Please Contact HeadOffice" , message: "Not Possible to create"
                })
        }

    }catch(error){
      console.log(error)
        let message = decode.name+ " " +`Something went wrong: ` +" "+getDate.getCurrentDate()+error;
        console.log(message);
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })
        return res.status(402).json({ code: 499,error: "Please Contact HeadOffice", message: message })
    }
}

module.exports = {createReturnSiteToStore}