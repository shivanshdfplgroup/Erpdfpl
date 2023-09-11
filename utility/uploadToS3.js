const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Create an instance of the S3 client with the access alias
const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials:{
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
  }
});

// Configure multer to upload files to S3
const uploadToS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    key: (req, file, cb) => {
      const fileName = file.fieldname;
      let uniqueFileName =""
      console.log(file)

      if(req.body.vendorName)
      {
        uniqueFileName = req.body.vendorName + '-' + fileName + '.' + file.originalname.split('.').slice(1).join('.');
      }
      else if(req.body.contractorName)
      {
        uniqueFileName = req.body.contractorName + '-' + fileName + '.' + file.originalname.split('.').slice(1).join('.');
      }
      else if(req.body.emailId) {
        uniqueFileName = req.body.emailId + '-' + file.originalname + '.' +  fileName + '.' + file.originalname.split('.').slice(1).join('.');       
      }
      else {
        uniqueFileName =  file.originalname +'.' + Date.now() + '.' +fileName+'.'  +file.originalname.split('.').slice(1).join('.');       
      }
      // console.log(uniqueFileName)
      cb(null, uniqueFileName);
    },
  }),
});






module.exports={uploadToS3}



