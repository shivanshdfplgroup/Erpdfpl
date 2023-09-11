const ForgotPassword = require("../models/forgotPassword.schema.js");
const Logs = require("../models/log.model.js");
const User = require("../models/user.schema.js");
const getDate = require('../middleware/getDate.js');

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createForgotPasswordRequest = async (req, res) => {
    try {
      // Create a new instance of the ForgotPassword model
    console.log('before',req.body);
    // now we only need mobile no in req.body
    const mobile = req.body.mobile.trim();
    // const role = req.body.role.trim();
    // const email = req.body.email.trim();
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }
      const newRequest = await ForgotPassword.create({
        mobile: mobile,
        email: ifUser.email,
        role: ifUser.role,
        type: "forgotPassword",
      });
    
      console.log('after', newRequest);
      let message = `Forgot password request created for mobile ${mobile}`;
  
      await Logs.create({
        logs: message,
        userId: req.body.mobile,
      });
  
      return res.status(200).json({
        code: 200,
        message: message,
        data: newRequest
      });
    } catch (error) {
        console.log(error);
        let message = req.body.mobile+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.mobile,
        });
    
        return res.status(500).json({
          code: 443,
          error: "Please Contact HeadOffice",
          message: "Internal Server Error"
        });
    }
  };

  const getForgotPasswordRequests = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // Fetch all forgot password requests from the database
      // req.query.token = req.headers.authorization;
    // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

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
      const requests = await ForgotPassword.find().sort({ createdAt: -1 });
      // console.log('all req', requests);
      let message = decode.name + " " +"Successfully retrieved all requests"+ " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res.status(200).json({
        code: 200,
        message: "Successfully retrieved forgot password requests",
        data: requests,
      });
    }
    } catch (error) {
      console.log(error);
      let message = decode.name +  " " + error  + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 445,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  const updateRequestStatus = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      const requestId = req.params.id; // Assuming you pass the ID as a parameter
  
      // Check if the provided ID is a valid MongoDB Object ID
      if (!mongoose.isValidObjectId(requestId)) {
        return res.status(400).json({
          code: 400,
          message: "Invalid request ID",
        });
      }
  
      // Find the request by _id and update the isApproved field
      const updatedRequest = await ForgotPassword.findByIdAndUpdate(
        requestId,
        { $set: { isApproved: true } },
        { new: true } // Return the updated document
      );
  
      if (!updatedRequest) {
        return res.status(404).json({
          code: 404,
          message: "Forgot password request not found",
        });
      }
  
      let message = `Request status updated for ID ${requestId} By ${decode.name}`;
      await Logs.create({
        logs: message,
        userId: req.params.id,
      });
  
      return res.status(200).json({
        code: 200,
        message: message,
        data: updatedRequest,
      });
    } catch (error) {
      console.log(error);
      let message = decode.name + " " + error+ " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.params.id,
      });
  
      return res.status(500).json({
        code: 446,
        error: "Please Contact HeadOffice",
        message: "Internal Server Error",
      });
    }
  };

  // create Change Password Request
  const createChangePasswordRequest = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // Create a new instance of the ForgotPassword model
    console.log('before',req.body);
    // now we only need mobile no in req.body
    const mobile = req.body.mobile.trim();
    const oldPassword = req.body.oldPassword.trim();
    const newPassword = req.body.newPassword.trim();
    const hashedPass = await bcrypt.hash(newPassword, 10);

    // const role = req.body.role.trim();
    // const email = req.body.email.trim();
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }
    if (await bcrypt.compare(oldPassword, ifUser.password)) {
      const newRequest = await ForgotPassword.create({
        mobile: mobile,
        email: ifUser.email,
        role: ifUser.role,
        type: "changePassword",
        value: hashedPass,
      });
    
      console.log('after', newRequest);
      let message = `Change password request created for mobile ${mobile} by ${decode.name}`;
  
      await Logs.create({
        logs: message,
        userId: req.body.mobile,
      });
  
      return res.status(200).json({
        code: 200,
        message: message,
        data: newRequest
      });
    } else {
      res.status(400).json({ message: "incorrect password" });
    }
    } catch (error) {
        console.log(error);
        let message = req.body.mobile+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.mobile,
        });
    
        return res.status(500).json({
          code: 500,
          error: "Please Contact HeadOffice",
          message: "Internal Server Error"
        });
    }
  };

  // create Change Email Request
  const createChangeEmailRequest = async (req, res) => {
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
    try {
      // Create a new instance of the ForgotPassword model
    console.log('before',req.body);
    // now we only need mobile no in req.body
    const mobile = req.body.mobile.trim();
    const password = req.body.password.trim();
    const newEmail = req.body.newEmail.trim();

    // const role = req.body.role.trim();
    // const email = req.body.email.trim();
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }
    if (await bcrypt.compare(password, ifUser.password)) {
      const newRequest = await ForgotPassword.create({
        mobile: mobile,
        email: ifUser.email,
        role: ifUser.role,
        type: "changeEmail",
        value: newEmail,
      });
    
      console.log('after', newRequest);
      let message = `Change Email request created for mobile ${mobile} by ${decode.name}`;
  
      await Logs.create({
        logs: message,
        userId: req.body.mobile,
      });
  
      return res.status(200).json({
        code: 200,
        message: message,
        data: newRequest
      });
    } else {
      res.status(400).json({ message: "incorrect password" });
    }
    } catch (error) {
        console.log(error);
        let message = req.body.mobile+ " " +error + " "+getDate.getCurrentDate();
        await Logs.create({
          logs: message,
          userId: req.body.mobile,
        });
    
        return res.status(500).json({
          code: 500,
          error: "Please Contact HeadOffice",
          message: "Internal Server Error"
        });
    }
  };
  
  module.exports = {
    createForgotPasswordRequest,
    getForgotPasswordRequests,
    updateRequestStatus,
    createChangePasswordRequest,
    createChangeEmailRequest,
  };