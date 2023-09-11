const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const Comparision = require("../models/comparision.schema");
const { sendEmail } = require("../middleware/sendEmailWithMessage.js");
const Project = require("../models/project.schema.js");

const createComparision = async (req, res) => {
  console.log(req.body);
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  // po ko hum validate kr denge right, then it will create an MRN from it
  // role -> storeManager
  try {
    let project = await Project.findOne({id:req.body.projectId})
    const sequenceVal = await Comparision.find({projectId:req.body.projectId}).count();
    const paddedSequenceVal = String(sequenceVal + 1).padStart(5, "0");
    const uniqueId = `CIPL/${project.projectCode}/Comparision/23-24/${paddedSequenceVal}`;
  

    // Assuming req.body.tableData is an array of objects, where each object represents a row in the table data
    // const tableData = req.body.tableData;

    // console.log(tableData)
    // Function to create a new quotation for each row in the table data

      
    // const token =req.headers.authorization;
    // const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    // Call the function to create quotations for each row in the table data
    const createdComparision = await Comparision.create({
        id:uuidv4(),
        comparisionId:uniqueId,
        prId:req.body.prId,
        projectId:req.body.projectId,
        projectName:req.body.projectName,
        selectedVendorsIds:req.body.selectedVendorsIds,
        createdBy:req.body.userId,
        preparedBy:decode.name
      
    }) // This will give you an array of created quotations for each row in the table data

    sendEmail("Comparision Approval",`${createdComparision.comparisionId} is Prepared By ${createdComparision.preparedBy} On ${getDate.getCurrentDate()} Please Approve.`, process.env.SUPER_ADMIN_EMAIL_ID)

    let message = decode.name+ " " +"created Comparision "+ createdComparision.comparisionId + " on"+getDate.getCurrentDate();

    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res
      .status(200)
      .json({
        code: 200,
        message: "Comparision Created",
        data: createdComparision,
      });

  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();

    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 418,
      error:"already exists with this prId and vendorName",
      message: "Internal Server Error",
    });
  }
};



const getAllComparision = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{
      // user specific, HO
      // pass projectId
      // const prId = req.body.prId;

      const token =req.headers.authorization;
      const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      // get = PM, approval = HO
      // if(decode.role !== 'Admin'&& decode.role !== 'SuperUser') return res.status(400).json({message: "You Didn't Belong to Admin"});
     
      const allComparision = await Comparision.find()
      console.log(allComparision)
      let message = decode.name+ " " + "retrieved all comparisions on" + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      return res.status(200).json({code: 200, data: allComparision,  message: "all comparisions are retrieved"});

  }catch(error){
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 419, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
  }
}

const getAllApprovedComparision = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{
      // user specific, HO
      // pass projectId
      // const prId = req.body.prId;

      const token =req.headers.authorization;
      const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      // get = PM, approval = HO
      // if(decode.role !== 'Admin'&& decode.role !== 'SuperUser') return res.status(400).json({message: "You Didn't Belong to Admin"});
     
      const allComparision = await Comparision.find({
        isApproved:true
      })
      console.log(allComparision)
      let message = decode.name+ " " + "retrieved all approved comparisions on" + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

      return res.status(200).json({code: 200, data: allComparision,  message: "all comparisions are retrieved"});

  }catch(error){
      console.log(error);
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 420, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
  }
}


const getComparisionWithComparisionId = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{

      // user specific, HO
      // pass projectId
      
     

      // 1) Add name to schema.prisma 
      // 2) name=materialCategory+materialSubCategory+materialDescription
      // 3) create dummy array of objects witg all values including name 
      // 4) Create a map{key, value}, where key=name(point 2) and value=(array of objects with name = key)
      // 5) return this map
      // dummy data

     let comparision = await Comparision.findOne({
      
        comparisionId:req.body.comparisionId
    });

    let statement = comparision!==null?comparision.comparisionId:""

    let message = decode.name+ " " + "retrieved comparision " +statement+ " on"+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });

     return res.status(200).json({code: 200, data: comparision, message: "Comparision is retrieved"});

    }
    catch (error){
      console.log(error)
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 421, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
    }
  }


  
const editComparisionById = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{

    console.log(req.body.remarks)

    let alreadyApprovedComparision = await Comparision.findOne({
      comparisionId:req.body.comparisionId
    })

    if(alreadyApprovedComparision.isApproved){
      return res.status(200).json({code: 200, message: "Comparision Is Already Updated"});
    }
   
    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

     let comparision = await Comparision.findOneAndUpdate(
    {
        comparisionId:req.body.comparisionId
      } ,
     {
        isApproved:req.body.isApproved,
       $set:{remarks:req.body.remarks,
      approvedBy:decode.name,
      approvedOnDate:Date.now()
      }
      }
    );
   

 
    console.log(comparision)
    let message = decode.name+ " " + "updated comparision " +comparision.comparisionId+ " on"+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
     return res.status(200).json({code: 200, data: comparision, message: "Comparision Status Is Updated"});

    }
    catch (error){
      console.log(error)
      let message = decode.name+ " " + error + " "+getDate.getCurrentDate();
      await Logs.create({
        logs: message,
        userId: req.body.userId,
      });
  
      return res.status(500).json({
        code: 422, error: "Please Contact HeadOffice" , message: "Internal Server Error"
      })
    }
  }



module.exports = {
createComparision, getAllComparision,getAllApprovedComparision, getComparisionWithComparisionId,editComparisionById
};
