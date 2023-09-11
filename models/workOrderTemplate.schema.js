const mongoose = require('mongoose');

const workOrderTermsAndCondition = new mongoose.Schema({
    nameOfTemplate:{type:String, unique:true},
    scopeOfWork: { type: String } ,
   priceBasis: { type: String } ,
    taxesAndDuties: { type: String } ,
   paymentTerms: { type: String } ,
   workCompletionSchedule: { type: String },
   keyMaterialsProcurement: { type: String },
    inspections: { type: String },
    defectLiabilityPeriod: { type: String },
    safetyRequirements: { type: String } ,
    statutoryRequirements: { type: String },   
    other: { type: String } ,
    performanceAndTermination: { type: String } ,
    transportation: { type: String } ,
});

const workOrderTermsAndConditions = mongoose.model('workOrderTermsAndCondition', workOrderTermsAndCondition)

module.exports = workOrderTermsAndConditions;
