const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true
  },
  vendorEmail: {
    type: String,
  },
  tradeName: {
    type: String
  },
  vendorPhone: {
    type: String
  },
  panNumber: {
    type: String,
  },
  gstNumber: {
    type: String,
  },
  aadhaarNumber: {
    type: String,
  },

  pdf: {
    type: String
  },
  pan_front:{
    type: String
  },
  aadhaar_front:{
    type: String
  },
  aadhaar_back:{
    type: String
  },



  vendorCategory: {
    type: String
  },
  natureOfBusiness: {
    type: String
  },
  vendorWebsite: {
    type: String
  },
  registeredOfficeAddress: {
    type: String
  },
  officeAddress: {
    type: String
  },
  bankInfo: {
    bankAccName: {
      type: String
    },
    bankAccNo: {
      type: String
    },
    bankIfscNo: {
      type: String
    }
  },
  authorizedContactPerson: [{
    name: {
      type: String
    },
    contactNumber: {
      type: String
    },
    email: {
      type: String
    }
  }],
  pfRegistrationNumber: {
    type: String
  },
  esicRegistrationNumber: {
    type: String
  },
  qualityCertification: {
    type: String
  },
  annualTurnover: {
    type: String
  },
  projectExperience: {
    type: String
  },
  projectDetails: [{
  
    customerName: {
      type: String
    },
    projectValue: {
      type: String
    },
    contactPerson: {
      type: String
    },
    contactNumber: {
      type: String
    },
    email: {
      type: String
    }
  }],
  copyOfCheque: {
    type: String
  },
  attachmentSheet: {
    type: String
  },
  attachmentWOCopies: {
    type: String
  },
  attachmentCompletionCertificates: {
    type: String
  },
  pdf: {
    type: String
  },
  projectName: {
    type: String
  },
  category: {
    type: String
  },
  vendor_code: {
    type: String
  },
  projectsAssigned: [{ type: String }],
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports=Vendor;