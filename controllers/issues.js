const Logs = require("../models/log.model.js");
const Issues = require("../models/issues.schema.js");
const User = require("../models/user.schema.js");
const getDate = require('../middleware/getDate.js');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../middleware/sendEmailWithMessage.js");

const createIssue = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      try {
        // const token = req.headers.authorization;
        // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    
        let userId=req.body.userId;
        let userName=req.body.userName;
        
        const user = await User.findOne({ id: userId });
        // now we can access all user Details
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        
        const issue = await Issues.create({
            userId: userId,
            userName: userName,
            message: req.body.message,
            screenName: req.body.screenName,
            // screenShotUrl: req.body.screenShotUrl,
            errorCode: req.body.errorCode,
        });
        sendEmail("Report Issue",`${issue.errorCode} ${issue.message} is found at ${issue.screenName} ,By ${decode.name} On ${getDate.getCurrentDate()} Please Look into this Issue.`, "vedant2000joshi@gmail.com");
        let message = decode.name+ " " +"created Issue: "+ issue.message + " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
        console.log('we created',issue);
        // console.log(task, getDate.getCurrentDate());
        return res.status(200).json({ code: 200, message: "issue submited", data: issue });
      } catch (error) {
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 513,
          error: "Please Contact HeadOffice",
          message: "Internal Server Error"
        });
      }
    };

    const solveIssue = async (req, res) => {
        const token =req.headers.authorization;
        const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
        try {
          const issueId = req.body.issueId;
          
          // Check if the issue with the given ID exists
          const issue = await Issues.findById(issueId);
          if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
          }
      
          // Update the 'isSolved' field to true
          issue.isSolved = true;
          await issue.save();
      
          // Optionally, you can log this action or perform additional tasks
          let message = decode.name+ " " +"solved Issue: "+ issue.message + " on "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
          
          return res.status(200).json({ code: 200, message: "Issue marked as solved", data: issue });
        } catch (error) {
          console.error(error);
          let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
          return res.status(500).json({
            code: 500,
            error: "Internal Server Error",
            message: "Failed to mark issue as solved",
          });
        }
      };

      const getAllIssues = async (req, res) => {
        const token =req.headers.authorization;
        const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
        try {
          // Fetch all issues from the database
          const issues = await Issues.find();
      
          let message = decode.name+ " " +"retrieved all Issues" + " on "+getDate.getCurrentDate();
          await Logs.create({
            logs: message,
            userId: req.body.userId,
          });

          return res.status(200).json({ code: 200, data: issues });
        } catch (error) {
          console.error(error);
          let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
          return res.status(500).json({
            code: 500,
            error: "Internal Server Error",
            message: "Failed to retrieve issues",
          });
        }
      };
      

module.exports = {
    createIssue,
    solveIssue,
    getAllIssues,
  };