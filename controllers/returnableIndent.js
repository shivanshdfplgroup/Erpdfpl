const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ReturnableIndentData = require('../models/returnableIndentData.schema.js');

const createReturnableIndentData = async(req, res) => {
    const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try{
        const returnableIndentId = uuidv4();
        const returnableIndentNumber = req.body.returnableIndentNumber
        const returnableIndentDate = req.body.returnableIndentDate
        const poNumber = req.body.poNumber
        const materialMainGroup = req.body.materialMainGroup
        const materialSubGroup = req.body.materialSubGroup
        const itemDescription = req.body.itemDescription
        const poQuantity  = req.body.poQuantity
        const balanceReturnableIndent  = req.body.balanceReturnableIndent
        const vendorName  = req.body.vendorName
        const invoiceNumber  = req.body.invoiceDate
        const invoiceDate  = req.body.invoiceDate
        const transporterName  = req.body.transporterName
        const grDate  = req.body.grDate
        const grDocumentFileKey = req.body.grDocumentFileKey
        const vehicleNumber  = req.body.vehicleNumber
        const ewayBillNumber   = req.body.ewayBillNumber
        const storageLocation  = req.body.storageLocation

        const returnableIndentUom = req.body.returnableIndentUom
        const returnableIndentQuantity = req.body.returnableIndentQuantity
        const returnableIndentRate = req.body.returnableIndentRate
        const returnableIndentAmount = req.body.returnableIndentAmount
        const returnableIndentContractorName = req.body.returnableIndentContractorName
        const returnableIndentGpName = req.body.returnableIndentGpName
        const remark = req.body.remark

        const newEntry = await ReturnableIndentData.create({
        
                returnableIndentId: returnableIndentId,
                returnableIndentNumber : returnableIndentNumber,
                returnableIndentDate : returnableIndentDate,
                poNumber: poNumber,
                materialMainGroup: materialMainGroup,
                materialSubGroup: materialSubGroup,
                itemDescription: itemDescription,
                poQuantity: poQuantity,
                balanceReturnableIndent: balanceReturnableIndent,
                vendorName: vendorName,
                invoiceNumber: invoiceNumber,
                invoiceDate: invoiceDate,
                transporterName: transporterName,
                grDate: grDate,
                grDocumentFileKey: grDocumentFileKey,
                vehicleNumber: vehicleNumber,
                ewayBillNumber: ewayBillNumber,
                storageLocation: storageLocation,
                returnableIndentUom : returnableIndentUom,
                returnableIndentQuantity : returnableIndentQuantity,
                returnableIndentRate : returnableIndentRate,
                returnableIndentAmount : returnableIndentAmount,
                returnableIndentContractorName : returnableIndentContractorName,
                returnableIndentGpName : returnableIndentGpName,
                remark : remark
          
        })
        let message = decode.name+ " " +`created returnableIndent form entry` +" on "+getDate.getCurrentDate();
        console.log(message);
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })
        return res.status(200).json({code: 200, message: "returnableIndent form entry created", data: newEntry})

    }catch(error){
        let message = decode.name+ " " +`Something went wrong: ` +" "+getDate.getCurrentDate();
        console.log(message);
        await Logs.create({
            logs: message,
            userId: req.body.userId,
        })
        return res.status(402).json({ code: 498, error: "Please Contact HeadOffice", message: message })
    }
}

module.exports = {createReturnableIndentData}