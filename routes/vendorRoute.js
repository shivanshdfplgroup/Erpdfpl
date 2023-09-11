const express = require("express");
const { uploadToS3 } = require("../utility/uploadToS3");
const { gstValidation, panValidation, uidValidation, otpValidation, bankInfoValidation, panImage, uidImage } = require("../utility/checkValidation");
const { makeAutomatePan, makeAutomate, makeScreeShot, makeScreeShotPan } = require("../utility/websiteScreenshot");
const { upload } = require("../MongoFunctions/multer_util");
const { deleteVendor } = require("../MongoFunctions/mongoVendorAdd");
const { deleteContractor } = require("../MongoFunctions/mongoContractorAdd.js");
const router = express.Router();


router.post(
    "/uidImage",
    uploadToS3.fields([
      { name: "uid_front", maxCount: 1 },
      { name: "uid_back", maxCount: 1 },
  
    ]),
    uidImage
    );

  router.post(
    "/panImage",
    uploadToS3.fields([
      { name: "pan_front", maxCount: 1 },
  
    ]),
    panImage
    );


  router.post(
    "/deleteVendor", deleteVendor
  );
  router.post(
    "/deleteContractor", deleteContractor
  );


  router.post(
    "/verifyGST", gstValidation
  );
  router.post(
    "/automatePan", makeAutomatePan
  );
  router.post(
    "/automate",  makeAutomate
  );
  router.post(
    "/screenShot",  makeScreeShot
  );
  router.post(
    "/screenShotPan", makeScreeShotPan
  );
  router.post(
    "/verifyPan", panValidation
  );
  router.post(
    "/verifyUid", uidValidation
  );
  router.post(
    "/verifyOtp",  otpValidation
  );
  router.post(
    "/verifyBankInfo", bankInfoValidation
  );
   

  module.exports = router