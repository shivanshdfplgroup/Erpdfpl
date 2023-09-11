const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getDate = require('../middleware/getDate.js');

const Logs = require("../models/log.model");

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const PurchaseOrder = require('../models/purchaseOrder.schema.js');
const PR = require('../models/pr.schema');
const Project = require('../models/project.schema');
const { sendEmail } = require('../middleware/sendEmailWithMessage.js');

const createPoEntry = async(req, res) => {

  // -> HO
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);

    try{
      let project = await Project.findOne({name:req.body.formData.projectName})
      const sequenceVal = await PurchaseOrder.find({projectId:req.body.projectId}).count()
      const paddedSequenceVal = String(sequenceVal + 1).padStart(5, '0');
      const uniqueId = `CIPL/${project.projectCode}/PO/23-24/${paddedSequenceVal}`;
    
      // const poId = uuidv4();
      const poId = uniqueId;
      const projectName = req.body.formData.projectName
      const poDate = req.body.formData.poDate
      const quotationDate=req.body.formData.quotationDate
      const msName = req.body.formData.nameOfMs
      const msAddress = req.body.formData.addressOfMs      
      const msGst = req.body.formData.gstOfMs
      const contactPersonName = req.body.formData.contactPerson
      const contactPersonMobile = req.body.formData.mobilePerson
      const contactPersonEmail = req.body.formData.emailPerson
      const poValidity = req.body.formData.validity + "" + req.body.formData.durationType
      const orderStatus = req.body.formData.orderStatus
      const subjectOfPo = req.body.formData.subjectPO  
      const referrenceSite = req.body.formData.refSite
      const tableData = req.body.tableData
      // const otherTermsAndConditions = req.body.otherTermsAndConditions
      const billingAddress = req.body.formData.billingAddress
      const deliveryAddress = req.body.formData.deliveryAddress
      const secondaryDeliveryAddress = req.body.formData.secondaryDeliveryAddressInput 
      const deliveryTerms = req.body.formData.deliveryTerms
      const deliveryTime = req.body.formData.deliveryTime
      const paymentTerms = req.body.formData.paymentTerms
      const tpiStatus = req.body.formData.tpiStatus
      const contactAtHeadOffice = req.body.formData.contactAtHeadOffice
      const otherTermsInDPR = req.body.formData.otherTermsInDPR
      const documentS3Key = req.body.documentS3Key
      const company = req.body.formData.company

      console.log(company)

      
      let getPr = await PR.findOne({prId:req.body.prId})

      console.log(getPr.tableData)


      const prTableData = getPr.tableData;
      const poTableData = req.body.tableData;


      for (let i = 0; i < poTableData.length; i++) {
        const poRow = poTableData[i];
        const correspondingPrRow = prTableData.find(prRow => (
            prRow.materialCategory === poRow.materialCategory &&
            prRow.materialSubCategory === poRow.materialSubCategory &&
            prRow.materialDescription === poRow.materialDescription
        ));

        if (correspondingPrRow) {
            // Subtract the quantity from PR table
            correspondingPrRow.quantity_balance -= poRow.quantity;
            if (correspondingPrRow.quantity < 0) {
              return res.status(500).json({
                code: 500,  message: `Row No. ${i+1} getting error of becoming Negative, (PR Is Fullfilled) Please Try Some Other Value`
              })
            }
        }
    }
    const allRowsZero = prTableData.every(prRow => prRow.quantity_balance === 0);
    console.log(prTableData, allRowsZero)


    await getPr.updateOne({ tableData: prTableData });
    if (allRowsZero) {  
      getPr.prStatus = true;
  }
  await getPr.save();


      const newPO = await PurchaseOrder.create({
          preparedBy:decode.name,
          poId : poId,
          projectName : projectName,
          poDate : poDate,
          msName : msName,
          msAddress : msAddress,
          msGst : msGst,
          contactPersonName : contactPersonName,
          contactPersonMobile : contactPersonMobile,
          contactPersonEmail : contactPersonEmail,
          poValidity:poValidity,
          quotationDate:quotationDate,
          orderStatus : orderStatus,
          subjectOfPo : subjectOfPo,
          referrenceSite : referrenceSite,
          tableData : tableData,
          // otherTermsAndConditions : otherTermsAndConditions,
          billingAddress : billingAddress,
          deliveryAddress : deliveryAddress,
          secondaryDeliveryAddress : secondaryDeliveryAddress,
          deliveryTerms : deliveryTerms,
          deliveryTime : deliveryTime,
          paymentTerms : paymentTerms,
          tpiStatus : tpiStatus,
          contactAtHeadOffice : contactAtHeadOffice,
          // quality : quality, in frontend
          otherTermsInDPR : otherTermsInDPR,
          documentS3Key : documentS3Key,
          poStatus: "In Process",
          company:company
       
      })




// return;
      sendEmail("Purchase Order Approval",`${newPO.poId} is Prepared By ${newPO.preparedBy} On ${getDate.getCurrentDate()} Please Approve.`, process.env.SUPER_ADMIN_EMAIL_ID)

      let message = decode.name+ " created New Purchase Order Entry Created";
      await Logs.create({
        logs: message+" "+getDate.getCurrentDate(),
        userId: req.body.userId,
      });
  

      return res.status(200).json({ code: 200, message: message, data: newPO })

    }catch(error){
        console.log(error);
        let message = decode.name+ " " +error + " "+getDate.getCurrentDate() + ' from createPoEntry';
        await Logs.create({
          logs: message,
          userId: req.body.userId,
        });
    
        return res.status(500).json({
          code: 477, error: "Please Contact HeadOffice" , message: "Internal Server Error"
        })
    }
}


const updatePoStatus = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{

    const poId = req.body.poId;
    const newStatus = req.body.newStatus;

    const updatedPo = await PurchaseOrder.find({
             poId: poId
          })
          let message = decode.name+ " " +"updated PO with poId: "+ poId + " "+getDate.getCurrentDate();
          await Logs.create({
            logs: message,
            userId: req.body.userId,
          });
    return res.status(200).json({ code: 200, message: "Success", data: updatedPo})

  }catch(error){
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate() + ' from updatePoStatus';
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 478, error: "Please Contact HeadOffice" , message: "Internal Server Error"
    })

  }
}
const getAllPoByProjectId = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{

    const projectId = req.body.projectId;

    console.log(projectId)

    let project = await Project.findOne({id:projectId})
    
    const updatedPo = await PurchaseOrder.find({
      projectName:project.name
     
    })
    console.log(updatedPo)
    let message = decode.name + " " + "retrieved all Purchase Orders for project: "+ project.name + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    
    return res.status(200).json({ code: 200, message: "Success", data: updatedPo})

  }catch(error){
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate() + ' from Fetching PO ';
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 479, error: "Please Contact HeadOffice" , message: "Internal Server Error"
    })

  }
}
const getAllPo = async(req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try{



    const updatedPo = await PurchaseOrder.find().sort({ createdAt: -1 });
    let message = decode.name + " " + "fetched all Purchase Orders"+ " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    
    return res.status(200).json({ code: 200, message: "Success", data: updatedPo})

  }catch(error){
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate() + 'from Fetching PO ';
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 480, error: "Please Contact HeadOffice" , message: "Internal Server Error"
    })

  }
}


const updatePurchaseOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {
    const userId = req.body.userId;
    console.log(req.body.userId, req.body.formData, "pdf, purchase Order")
    const po = await PurchaseOrder.findOneAndUpdate(
      {
      poId:req.body.poId
      },
      {
        pdfOfPurchaseOrder: decodeURIComponent(
          `https://${process.env.BUCKET_SHORT_NAME}.s3.amazonaws.com/${req.file.key}`
        ),
      }
    );
    //   IMP: remember to replace req.body.value as no value field in this schema
    let message = `${decode.name} update Purchase Order  ${
      po.poId
    } on ${getDate.getCurrentDate()}`;
    console.log(message)
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "Purchase Order Updated", data: po });
  } catch (error) {
    console.log(error);
    let message = decode.name+ " " +error + " "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });

    return res.status(500).json({
      code: 481,
      error: "Please Contact HeadOffice",
      message: "Internal Server Error",
    });
  }
};

const approvePurchaseOrder = async (req, res) => {
  const token =req.headers.authorization;
  const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  try {

    const token =req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  
    const poId = req.body.poId;

    const updatedPurchaseOrder = await PurchaseOrder.findOneAndUpdate(
      { poId: poId },
      { $set: {isApproved: true,
      approvedBy:decode.name,
      approvedOnDate:Date.now()
      } },
      { new: true } // Return the updated document
    );

    if (!updatedPurchaseOrder) {
      return res.status(404).json({ code: 404, message: "Purchase Order not found" });
    }
    let message = decode.name + " " + "approved Purchase Order with poId: "+ poId + " on "+getDate.getCurrentDate();
    await Logs.create({
      logs: message,
      userId: req.body.userId,
    });
    return res
      .status(200)
      .json({ code: 200, message: "Purchase Order Approved", data: updatedPurchaseOrder });
  } catch (error) {
    console.log(error);
    let message = decode.name + " " + error + " "+getDate.getCurrentDate();
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
    createPoEntry, updatePoStatus,getAllPoByProjectId,getAllPo, updatePurchaseOrder, approvePurchaseOrder
}