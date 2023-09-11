const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token=req.headers.authorization;
        const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
        
        const userId = decode.id;
        const userRole = decode.role
        // console.log(req.body, req.file)

    
      
        // if ( req.body.userId !== userId || req.body.role !== userRole) {
        //     console.log("Error")
        //     throw Error('Invalid user');
        //   } else {
            next();
        // }
       
    }catch(error){
        console.error(error);
        message = error + ' is present in middleware auth service, TS: ' + Date.now();
        await Logs.create({
            message: message
        })

        return res.status(500).json({code : 500, message: message, error: error})
    }
}

module.exports = auth