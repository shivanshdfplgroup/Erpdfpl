const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const createBomEntry = async(req, res) => {
    try{

      // HO
      
      const materialName = req.body.materialName
      const materialDescription = req.body.materialDescription;
       
      const bomId = uuidv4();

      const newBom = await prisma.bOM.create({
        data: {
          bomId: bomId,
          materialName: materialName,
          materialDescription: materialDescription
        },
        select: {
          bomId: true,
          materialName: true,
          materialDescription: true,
          isApproved: true,
          createdAt: true
        }
      })

      return res.status(200).json({
        code: 200,
        data: newBom,
        message : 'BOM Created'
      })

    }catch(error){
        console.log(error);
        let message = req.body.userName+ " " + error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 423, error , message: "Internal Server Error"
        })
    }
}

module.exports = {
    createBomEntry
}