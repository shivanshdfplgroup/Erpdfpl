// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const User = require("../models/user.schema.js");
const Project = require("../models/project.schema.js");
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");
const Roles = require("../models/roles.schema.js");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../middleware/sendEmailWithMessage.js");
const ForgotPassword = require("../models/forgotPassword.schema.js");

const registerUser = async (req, res) => {
  try {
    let password = req.body.password;

    password = password.trim();
    const name = req.body.name.trim();
    const mobile = req.body.mobile.trim();
    // let role = await Roles.findById(req.body.role)
    let role = req.body.role.trim()



    const email = req.body.email.trim();
    const hashedPass = await bcrypt.hash(password, 10);
    
    // const roleObject = await Roles.findById(role); // Replace roleId with the actual _id value

    // if (!roleObject) {
    //   res.status(404).json({ code: 404, message: "Role not found" });
    //   return;
    // }
    // console.log('our object', roleObject);

    const user = await User.create({
        id: uuidv4(),
        name: name,
        mobile: mobile,
        password: hashedPass,
        company: req.body.company,
        email:email,
        role: role,
        otp: parseInt(req.body.otp),
        isVerified: false,
    });

    // Generate and send an email with registration details
    const emailSubject = "User Registration Successful";
    const emailText = `
      User registration details:
      Name: ${name}
      Mobile: ${mobile}
      Password: ${password}
      Role: ${role}
      Company: ${req.body.company}
      Email: ${email}
      OTP: ${req.body.otp}
      Link To Login: http://54.91.212.206:8080/login
    `;

    const result = await sendEmail(emailSubject, emailText, email);

    const token = jwt.sign({ id:user.id, name, mobile, role }, process.env.JWT_AUTH_SECRET);
    let message1 = `User ${req.body.name} from ${req.body.company}, accepted Terms and Conditions to Register`;
    await Logs.create({
      logs: message1,
      userId: req.body.mobile,
    });

    let message = `User ${req.body.name} from ${req.body.company}, registered in successfully`;

    await Logs.create({
      logs: message + " " + result + " "+getDate.getCurrentDate(),
      userId: req.body.mobile,
    });

    console.log(message+ " " + result);
    
    return res
      .status(200)
      .json({
        code: 200,
        message: message,
        data: { id:user.id, name, mobile, role },
        token: token,
      });
      
  } catch (error) {
    console.log(error);
    let message = req.body.name + error +  " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.mobile,
    })

    return res
      .status(500)
      .json({ code: 401, message: "Internal Server Error", error: "Please Contact to HeadOffice" });
  }
};

const loginUser = async (req, res) => {
  try {
    let mobile = req.body.mobile.trim();

    const user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log(req.body.otp)
    if (!user.isVerified) {
        if(req.body.otp===null || req.body.otp==="" ){
            return res.status(200).json({ code: 100, message: "First-time user, please verify OTP." });
        }
        else if (req.body.otp!==null && parseInt(req.body.otp) === user.otp) {
          user.isVerified = true;
       
          const updatedUser = await User.findOneAndUpdate(
            { mobile: mobile},
            { $set: {isVerified: true}},
            { new: true }
          );
        } else {
                return res.status(200).json({ code: 300, message: "Please enter the correct OTP." });
        }
      } 

    if (await bcrypt.compare(req.body.password, user.password)) {
      let { id, name, mobile, role, projectRoleObject } = user;
      let projectsOfUser=[]
      if(projectRoleObject !=null)
      { projectsOfUser = await Project.find(
        { id: { $in: projectRoleObject } }, // Match projects with the specific `id` values from projectRoleObject
        { name: true, id: true }
      );
    }
      console.log(user)
      const token = jwt.sign(
        {  id, name, mobile, role },
        process.env.JWT_AUTH_SECRET
      );
      let message = `User: ${name}, logged in successfully` + " "+getDate.getCurrentDate();

      await Logs.create({
        logs: message,
        userId:req.body.mobile,
      });

      console.log(message);
      console.log(token);
      return res
        .status(200)
        .json({
          message: "User logged in successfully",
          token: token,

          data: { id, name, mobile, role, projectsOfUser },
        });
    } else {
      res.status(400).json({ message: "incorrect password" });
    }
  } catch (error) {
    console.log(error);
    let message = req.body.mobile + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId:req.body.mobile,
    });
    return res
      .status(500)
      .json({ code: 402, message: "Internal Server Error", error: "Please Contact to HeadOffice" });
  }
};

const showAllUsers = async(req, res) => {
  try{

    /**
     * get all users from user table
     */

    // const allUsersData = await prisma.user.findMany({
    //   select: {
    //     name: true,
    //     email: true,
    //     role: true,
    //     isVerified: true,
    //     id:true,
    //     projectsAssigned: true,
    //     mobile:true
    //   }
    // })

    const allUsersData = await User.find({}, { name: true, email: true, role: true, isVerified: true, id: true, projectsAssigned: true, mobile: true });


    console.log(allUsersData);
    return res.status(200).json({ code: 200, data: allUsersData})

  }catch(error){
    console.log(error);
    let message = error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message
    });

    return res.status(500).json({
      code: 500, error , message: "Internal Server Error"
    })
  }
}

const addRemoveProjectAndRoleFromUser = async(req,res) => {
  console.log(req.body)
  try{

    /**
     * Send user's id as id in the body
     * and an object which has keys as projectId and role as value
     * 
     * ex -
     *  body = {
     *  id: "123456ab",
     *  projectAndRole: {
     *  "projectA-id": "roleA",
     *  "projectB-id": "roleB"
     * } 
     * } 
     * 
     *  we are doing it this way so that we can have multple projects having different roles for same person
     * dont just send the changed data, send the whole data, like if a new project is given to the user, then there should be 3 attributes in the object
     */

    const userId = req.body.id;
    const projectAndRoleObject = req.body.projectAndRole;

    // const updatedUser = await prisma.user.update({
    //   where: {
    //     id: userId
    //   },
    //   data: {
    //     projectRoleObject: projectAndRoleObject
    //   },
    //   select: {
    //     name: true,
    //     email: true,
    //     role: true,
    //     isVerified: true,
    //     projectRoleObject: true
    //   }
    // })

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { projectRoleObject: projectAndRoleObject } },
      { new: true, select: { name: true, email: true, role: true, isVerified: true, projectRoleObject: true } }
    );

    let message = req.body.userName + " " + updatedUser +" "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: userId,
    })

    return res.status(200).json({ code: 200, data: updatedUser, message: " Updated user record"});

  }catch(error){

    console.log(error);
    let message = req.body.userName + " " + error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.id, 
    });

    return res.status(500).json({
      code: 403, error: "Please Contact to HeadOffice" , message: "Internal Server Error"
    })    
  }
}

// const forgotPassword = async(req, res) => {
//   try{

//     /**if condition for checking if user is superAdmin, if not -> return otherwise -> continue */
//     const userId = req.params.id;
//     const email = req.body.email;
//     const updatedPassword = req.body.password;
//     const hashedPass = await bcrypt.hash(password, 10);

//     updatedData = {
//       password: hashedPass
//     }

//     const updatedUser = await User.updateOne({ id: userId }, updateData);
//     if (updatedUser.nModified === 1) {
//       return res.json({ message: 'User attributes updated successfully' });
//     } else {
//       return res.status(404).json({ error: 'User not found' });
//     }

//   }catch(error){
//     console.log(error);
//     let message = error + " "+getDate.getCurrentDate();
//     await Logs.create({
//       logs: message
//     });

//     return res.status(500).json({
//       code: 500, error , message: "Internal Server Error"
//     })   
//   }
// }

const forgotPassword = async(req, res) => {
  try{

    /**if condition for checking if user is superAdmin, if not -> return otherwise -> continue */
    console.log('we got', req.body);
    let mobile = req.body.mobile.trim();
    let type = req.body.type.trim();
    let objectId = req.body._id.trim();

    const user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = user.id;
    const email = user.email;
    // const updatedPassword = req.body.password;
    // using updated Password here previous code used password in bcrypt.hash
    // const hashedPass = await bcrypt.hash(updatedPassword, 10);

    // updatedData = {
    //   password: hashedPass
    // }
    // console.log('one', user);
    // console.log('two', updatedPassword);
    // const updatedUser = await User.updateOne({ id: userId }, updatedData);
    // console.log('three', updatedUser);
     // Generate a JWT token with user's ID and secret key
     if(type==="forgotPassword"){
      console.log("forgot request processed");
      const resetToken = jwt.sign({ userId: userId }, process.env.JWT_AUTH_SECRET, { expiresIn: '2d' });

      // Compose the reset link
      const resetLink = `http://54.91.212.206:8080/reset-password?token=${resetToken}`;
    
      // Compose and send the reset email
      let result = await sendEmail(
        "Forgot Reset Password Link",
        `
         Your Forgot Password Link
        Click the following link to reset your password:
        ${resetLink}
        `,
        email
      );
      
      await ForgotPassword.findOneAndUpdate({mobile:user.mobile},{$set:{isApproved:true}})
    
        if (result=="Email Sent") {
          return res.status(200).json({code: 200, message: 'User password updation Link Sent successfully' });
        } else {
          return res.status(404).json({code: 404, error: 'User not found' });
        }
     } 
     if(type==="changePassword"){
      let value = req.body.value.trim();
      console.log('changePassword');
      updatedData = {
        password: value
      }
      const updatedUser = await User.updateOne({ id: userId }, updatedData);
      await ForgotPassword.findOneAndUpdate(
        { _id: objectId },
        { $set: { isApproved: true } }
      );
      console.log('ipdated: ',updatedUser);
      return res.status(200).json({code: 200, message: 'User password changed successfully' });
     }
     if(type==="changeEmail"){
      let value = req.body.value.trim();
      console.log('changeEmail');
      updatedData = {
        email: value
      }
      const updatedUser = await User.updateOne({ id: userId }, updatedData);
      await ForgotPassword.findOneAndUpdate(
        { _id: objectId },
        { $set: { isApproved: true } }
      );
      console.log('ipdated: ',updatedUser);
      return res.status(200).json({code: 200, message: 'User email changed successfully' });
     }
     

  }catch(error){
    console.log(error);
    let message = req.body.mobile+" "+ error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.mobile,
    });

    return res.status(500).json({
      code: 405, error: "Please Contact to HeadOffice" , message: "Internal Server Error"
    })   
  }
}
const resetPassword = async (req, res) => {
  try {
    const token = req.body.token;
    let newPassword = req.body.password;
    console.log(token)
    try {
      const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET);

      // Find the user based on the decoded userId (mocked example)
      console.log(decoded)
      const user = await User.findOne({ id: decoded.userId });

      if (!user) {
        return res.status(404).json({ 
          code: 404,
          message: 'User not found'
        });
      }

      // Update the user's password in the database (mocked example)
      newPassword= await bcrypt.hash(newPassword, 10);
      user.password =newPassword;
      await user.save();

      let message = 'Password Resetted For User ' + user.name + ' at ' + new Date();
      await Logs.create({
        logs: message,
        userId: user.id,
      });

      return res.status(200).json({
        code: 200,
        message: 'Password Resetted Successfully'
      });
    }
     catch (verificationError) {
      console.log(verificationError);
      let message = verificationError + ' at ' + new Date();
      await Logs.create({
        logs: message
      });

      return res.status(400).json({
        code: 400,
        message: 'Invalid or Expired Token'
      });
    }
  } catch (error) {
    console.log(error);
    let message = error + ' at ' + new Date();
    await Logs.create({
      logs: message,
      userId: req.body.token,
    });

    return res.status(500).json({
      code: 406,
      error: "Please Contact to HeadOffice",
      message: 'Internal Server Error'
    });
  }
};

const getSingleUser = async(req, res) => {
  try{

      // user specific, HO

      const particularUserId = req.body.specificUserId;

      const particularUserData = await User.find(
          { id: particularUserId },
          {
            name: true,
            email: true,
            role: true,
            isVerified: true,
            id:true,
            projectRoleObject: true,
            mobile:true
          }
      );

      return res.status(200).json({code: 200, data: particularUserData, message: "user with particular id retrieved"});

  }catch(error){
      console.log(error);
      let message = req.body.specificUserId +" " +error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.specificUserId,
      });
  
      return res.status(500).json({
        code: 407, error: "Please Contact to HeadOffice", message: "Internal Server Error"
      })
  }
}

module.exports = {
  registerUser,
  loginUser,
  showAllUsers,
  addRemoveProjectAndRoleFromUser,
  forgotPassword,
  getSingleUser,
  resetPassword
};
