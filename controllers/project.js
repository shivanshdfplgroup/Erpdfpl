const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Vendor = require("../Schemas/vendorSchema");
const Contractor = require("../Schemas/contractorSchema");
const User = require("../models/user.schema.js");
const Project = require("../models/project.schema.js");
const { ObjectId } = require('mongodb');

const createProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // // role -> HO, Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      
        mobile: mobile,
     
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role) {
      //console.log(req.body.assignedTo);
      const projectId = uuidv4();
      let projectName = req.body.projectName.trim();
      let projectCode = req.body.projectCode.trim();
      let gpName = req.body.gpName;    
      let assignedTo = req.body.assignedTo; // -> send mobile number as assigned member of the respective w

      if (assignedTo.length == 0 || typeof assignedTo == undefined) {
        assignedTo = [];
      }
      //checking if already present project Code
      const alreadyPresent = await Project.findOne({projectCode})

      if(alreadyPresent){
        let message = `Project Code is Not Present Or Entered A Already Used Code By ${decode.name}`;
        await Logs.create({
          logs: message+ " on "+getDate.getCurrentDate(),
          userId: req.body.userId,
        });
  
        //console.log(message);
        return res.status(400).json({
          code: 200,
          message: `Project Code is Not Present Or Entered A Already Used Code`,
        });
  
      }

      //console.log("Hererpokpokfdspokgopfg")
      
      const newProject = await Project.create({
       
          id: projectId,
          name: projectName,
          // blockName:req.body.blockName,
          // stores:req.body.stores, 
          locationName:req.body.locationName,
          gpName: gpName,
          assignedTo: assignedTo,
          projectCode:projectCode
      });
        //console.log(newProject)
      let message = `Project: ${projectName} BY ${decode.name}, has been created`;


        const updateUser = await User.updateMany(
          {id: { $in: assignedTo }},
        
      {  $push: { projectsAssigned: projectId }}
        
      )
        

      await Logs.create({
        logs: message+ " on "+getDate.getCurrentDate(),
        userId: req.body.userId,
      });

      //console.log(message);
      return res.status(200).json({
        code: 200,
        message: message,
        data: { projectName, gpName, assignedTo },
      });

    } else {
      let message = `User: ${decode.name}, not allowed`;
      //console.log(message);
      return res.status(402).json({ code: 302, message: message });
    }


  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 486, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};

const allProjects = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
    
        mobile: mobile,
      
    });

    if (!ifUser) {
      let message = `User does not exist`;
      //console.log(message);
      return res.status(401).json({ code: 401, message: message });
    }

    if (ifUser.role) {

      const projects = await Project.find();

      // let message = `Project: ${projectName} under ${companyName}, has been created`;
      // await Logs.create({
      //     logs: message
      // })

      //console.log(projects);
      let message = decode.name+ " " +"retrieved all Projects" + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
      return res.status(200).json({
        code: 200,
        message: "Projects Provided",
        data: projects ? projects : [],
      });
    } else {
      let message = `User: ${decode.name}, not allowed`;
      //console.log(message);
      // await Logs.create({
      //     logs: message
      // })
      return res.status(402).json({ code: 302, message: message });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 487, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};

const addMembers = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
 
        mobile: mobile,
  
    });

    if (!ifUser) {
      let message = `User does not exist`;
      //console.log(message);
      await Logs.create({
        logs: message,
        userId: mobile,
      });
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role === "Admin" || ifUser.role === "SuperUser") {
      const projectId = req.body.id;
      const project = await Project.find(
        {
          id:projectId
        }
        );
        //console.log(project)

      const oldAssigned = project[0].assignedTo;
      const newAssigned = req.body.newAssigned;

      // Get the elements that are in newAssigned but not in oldAssigned
      const addedMembers = newAssigned.filter(
        (memberId) => !oldAssigned.includes(memberId)
      );

      // Get the elements that are in oldAssigned but not in newAssigned
      const removedMembers = oldAssigned.filter(
        (memberId) => !newAssigned.includes(memberId)
      );

      //console.log(projectId);
      const updateProject = await Project.findByIdAndUpdate(project[0]._id,
      {
          assignedTo: newAssigned,
        }
      );

      
    const filter = { id: { $in: addedMembers.map(memberId => memberId) } };
    const update = { $push: { projectsAssigned: projectId } };


      const updatedUser = await User.updateMany(filter,update);

      const updatedUsers = await Promise.all(
        removedMembers.map(async (userId) => {
          const user = await User.find(
            {
              id:userId}
              );

          if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
          }

          let userAssignedProjects = user.projectsAssigned;
          //   //console.log(userAssignedProjects)
          userAssignedProjects = userAssignedProjects.filter(
            (project) => project !== projectId
          );
          //   //console.log(userAssignedProjects)

          const updatedUser = await User.findByIdAndUpdate(
           userId ,
            {
              $set: { projectsAssigned: userAssignedProjects } 
          });
          //console.log(updatedUser.projectsAssigned);
          return updatedUser;
        })
      );

      let message = `Updated the list of assigned users of the project by ${decode.name}`;

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: updateProject });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 488, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};


const addVendors = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      //console.log(message);
      await Logs.create({
        logs: message,
        userId: mobile,
      });
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role === "Admin" || ifUser.role === "SuperUser") {
      // 1->req.body.id =) projectId
      const projectId = req.body.id;
      const project = await Project.findOne({ id: projectId });

      if (!project) {
        let message = `Project not found`;
        //console.log(message);
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
        return res.status(404).json({ code: 404, message: message });
      }

      const oldVendors = project.vendorAssignedTo;
      // 2->req.body.newVendors
      const newVendors = req.body.newVendors;

      // Get the vendors that are in newVendors but not in oldVendors
      const addedVendors = newVendors.filter(
        (vendorId) => !oldVendors.includes(vendorId)
      );

      // Get the vendors that are in oldVendors but not in newVendors
      const removedVendors = oldVendors.filter(
        (vendorId) => !newVendors.includes(vendorId)
      );

      // Update the project's vendorAssignedTo array
      const updatedProject = await Project.findOneAndUpdate(
        { id: projectId },
        { $set: { vendorAssignedTo: newVendors } },
        { new: true }
      );

      // Update the vendors' projectsAssigned arrays for added vendors
      const updateAddedVendors = await Vendor.updateMany(
        { _id: { $in: addedVendors } },
        { $push: { projectsAssigned: projectId } }
      );

      // Update the vendors' projectsAssigned arrays for removed vendors
      const updateRemovedVendors = await Vendor.updateMany(
        { _id: { $in: removedVendors } },
        { $pull: { projectsAssigned: projectId } }
      );

      let message = `Updated the list of assigned vendors and projects for the project by ${decode.name}`;

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: updatedProject });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 489, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};


const addContractors = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;
    // // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      //console.log(message);
      await Logs.create({
        logs: message,
        userId: mobile,
      });
      return res.status(401).json({ code: 302, message: message });
    }

    if (ifUser.role === "Admin" || ifUser.role === "SuperUser") {
      // req.body.id = projectId
      const projectId = req.body.id;
      const project = await Project.findOne({ id: projectId });

      if (!project) {
        let message = `Project not found`;
        //console.log(message);
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
        return res.status(404).json({ code: 404, message: message });
      }

      const oldContractors = project.contractorAssignedTo;
      const newContractors = req.body.newContractors;

      // Get the contractors that are in newContractors but not in oldContractors
      const addedContractors = newContractors.filter(
        (contractorId) => !oldContractors.includes(contractorId)
      );

      // Get the contractors that are in oldContractors but not in newContractors
      const removedContractors = oldContractors.filter(
        (contractorId) => !newContractors.includes(contractorId)
      );

      // Update the project's contractorAssignedTo array
      const updatedProject = await Project.findOneAndUpdate(
        { id: projectId },
        { $set: { contractorAssignedTo: newContractors } },
        { new: true }
      );

      // Update the contractors' projectsAssigned arrays for added contractors
      const updateAddedContractors = await Contractor.updateMany(
        { _id: { $in: addedContractors } },
        { $push: { projectsAssigned: projectId } }
      );

      // Update the contractors' projectsAssigned arrays for removed contractors
      const updateRemovedContractors = await Contractor.updateMany(
        { _id: { $in: removedContractors } },
        { $pull: { projectsAssigned: projectId } }
      );

      let message = `Updated the list of assigned contractors and projects for the project by ${decode.name}`;

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: updatedProject });
    }
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 490, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};




const deleteMembers = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {

    // console.log("herre")
    // return;
    // req.query.token = req.headers.authorization;
    // // -> Admin
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.find({
        mobile: mobile,
    });

    if (!ifUser) {
      let message = `User does not exist`;
      //console.log(message);
      await Logs.create({
        logs: message,
        userId: mobile,
      });
      return res.status(401).json({ code: 302, message: message });
    }
    

    const memberId = req.body.memberId;
    if (ifUser.role) {
     


      const projects = await Project.find({
        assignedTo: { $in: [memberId] }
    });
      

      const updatePromises = projects.map(project => {
        const updatedAssignedTo = project.assignedTo.filter(id => id !== memberId);
        
        return Project.findByIdAndUpdate(project.id, {$set: { assignedTo: updatedAssignedTo }});

      });
      
      await Promise.all(updatePromises);

    }
    const member = await User.findOneAndDelete({id:memberId});
    let message = decode.name+ " " +"deleted Member " + member.name + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res.status(200).json({ code: 200, message: "Member Successfully Deleted" });


  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 491, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};

const singleProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  // role -> HO, Admin

  try {
    req.query.token = req.headers.authorization;
    const projectId = req.query.id;
    //console.log(projectId);
    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    let mobile = decode.mobile;
    const ifUser = await User.findOne({
      
        mobile: mobile,
      
    });

    if (!ifUser) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }

      const project = await Project.findOne({
        
          id: projectId, // Replace `projectId` with the actual ID value
        
      });
      let message = `Project: ${project.name} has been shown to ${ifUser.name}`;
      // await Logs.create({
      //     logs: message
      // })
      await Logs.create({
        logs: message+ " on "+getDate.getCurrentDate(),
        userId: req.body.userId,
      });

      // //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: { project } });
   
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 492, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};


const userProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    // req.query.token = req.headers.authorization;

    // const token = req.query.token;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    const ifUser = await User.find({id:decode.id});

    if (!ifUser[0]) {
      let message = `User does not exist`;
      console.log(message);
      return res.status(401).json({ code: 302, message: message });
    }

    // ifUser.projectsAssigned

    const project = await Project.find( { id: { $in: ifUser[0].projectsAssigned.map(id => id) } });

    let message = `Assigned Project has been shown to ${ifUser[0].name}`;
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    // await Logs.create({
    //     logs: message
    // })

    //console.log(message);
    return res.status(200).json({ code: 200, message: message, data: project });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 493, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};



const getGpsAssosiatedWithProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {

    let gps = await Project.findOne({id:req.body.projectId})

    gps = gps.gpName

      let message = `Fetch gps In Project having projectId: ${req.body.projectId} By ${decode.name} on ${getDate.getCurrentDate()}`;

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: gps });
    
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 488, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};


const updateGpsWithinProject = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {

    let gps = await Project.findOne({id:req.body.projectId})
    let projectName= gps.name
   gps.gpName = req.body.gpName

   await gps.save()

      let message = `Gps: ${gps.name} Updated In Project having projectName: ${projectName} By ${decode.name} on ${getDate.getCurrentDate()}`;

      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      //console.log(message);
      return res
        .status(200)
        .json({ code: 200, message: message, data: gps });
    
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(500)
      .json({ code: 488, message: "Internal Server Error", error: "Please Contact HeadOffice" });
  }
};

module.exports = {
  createProject,
  addMembers,
  addVendors,
  addContractors,
  allProjects,
  singleProject,
  userProject,
  deleteMembers,
  getGpsAssosiatedWithProject,
  updateGpsWithinProject
};
