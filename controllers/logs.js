const Logs = require("../models/log.model.js");
const User = require("../models/user.schema.js");
const getDate = require('../middleware/getDate.js');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const getAllLogs = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // Fetch all logs from the database
    // req.query.token = req.headers.authorization;
    // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    const searchTerm = req.body.search
    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      await Logs.create({
        logs: message,
        userId: mobile,
      });
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role === "SuperUser") {

      console.log(req.query.page)
      const page = parseInt(req.query.page) || 1;
      const pageSize = 50;
      const skip = (page - 1) * pageSize;


        let query = {};
    
    
        if (searchTerm) {
            query.logs = { $regex: searchTerm, $options: 'i' };
        }
        
        const logs = await Logs.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);
    
        // console.log(logs); // Check the retrieved logs
   
        let message = decode.name + " " +"retrieved all logs "+ " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
      return res.status(200).json({
        code: 200,
        message: "Successfully retrieved logs",
        data: logs,
      });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name + "Error: " + error + " " + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 500,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};


  
  module.exports = {
    getAllLogs,
  };