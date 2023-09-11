const Logs = require("../models/log.model.js");
const User = require("../models/user.schema.js");
const getDate = require('../middleware/getDate.js');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const DateEnabled = require("../models/date.schema.js");


const enabledDate = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    
    const dateDoc = await DateEnabled.findOneAndUpdate(
      { company: "CIPL" }, // Add any relevant query criteria
      {
        backDate:req.body.options.backDate,
        currentDate:req.body.options.currentDate,
        futureDate:req.body.options.futureDate ,
      },
      { upsert: true, new: true }
    );
    let message = decode.name + "update Date Schema" + " "+getDate.getCurrentDate();

    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res.status(200).json({
        code: 200,
        message: "Successfully Updated Date Schema",
        data: dateDoc,
      });
    
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


const getEnabledDate = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    
    const dateDoc = await DateEnabled.findOne({ company: 'CIPL' }).select({
      backDate: 1,
      currentDate: 1,
      futureDate: 1,
    });
    let message = decode.name + "fetched Date Schema" + " "+getDate.getCurrentDate();
    console.log(dateDoc)
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
      return res.status(200).json({
        code: 200,
        message: "Successfully Fetched Date Schema",
        data: dateDoc,
      });
    
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
    enabledDate,
    getEnabledDate
  };