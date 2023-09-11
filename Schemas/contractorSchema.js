const mongoose = require('mongoose')

const contractorSchema = new mongoose.Schema({
  contractorName: {
    type: String,
    required: true
  },
  contractorEmail: {
    type: String,
  },
  tradeName: {
    type: String
  },
  contractorPhone: {
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



  contractorCategory: {
    type: String
  },
  natureOfBusiness: {
    type: String
  },
  contractorWebsite: {
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
  contractor_code: {
    type: String
  },
  projectsAssigned: [{ type: String }],
});

const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports=Contractor;