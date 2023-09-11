const express = require("express");
const { Router, application } = require("express");
const router = express.Router();

const { auth } = require('../middleware/auth');
const {upload} = require('../MongoFunctions/multer_util')
const { showAllUsers, addRemoveProjectAndRoleFromUser, forgotPassword, getSingleUser } = require("../controllers/authentication");
const { createProject, addMembers, addVendors, addContractors, allProjects, singleProject, userProject, deleteMembers, getGpsAssosiatedWithProject, updateGpsWithinProject } = require("../controllers/project");
const { createItem, readItem, readAllItems, updateItem, deleteItem } = require("../controllers/inventory");
const { createTask, updateTaskStatus, getAllTasksOfProject, getSingleTask, getAllTasksOfUser, updateTaskCompletion, updateTaskUpdate } = require("../controllers/toDo");
// const {createMrnEntry, getMrnRelatedToPo} = require("../controllers/mrn")
// const { createTask, updateTaskStatus, getAllTasksOfProject } = require("../controllers/toDo");
const {createMrnEntry, getMrnRelatedToPo, getMrnRelatedToProject, getMrnTableByMrnId, getSingleMRN} = require("../controllers/mrn")
const { createIndent, getAllIndent, getProjectwiseAllIndent, getUserIndent, editIndent, getAppIndent, getRecIndent, getApprovedIndent, getApprovedIndentByProjectId, getIndentById } = require("../controllers/siteIndent");
const {createPr, getAllPr, getNotApprovedPr, getApprovePr} = require("../controllers/pr");
const {createGrn, getAllGrn } = require("../controllers/grn");
const {createMtoEntry, getMTO, getMTOProjectWise} = require("../controllers/mto");
// const { createCategory, getCategory, createSubCategory, createSubSubCategory, createStoreItem, getStoreItem, deleteStoreItem, deleteAllCat } = require("../controllers/store");
const { createReturnSiteToStore} = require("../controllers/returnSiteToStore");
const { createReturnableIndentData } = require("../controllers/returnableIndent");
const { createPoEntry, updatePoStatus, getAllPoByProjectId, getAllPo, updatePurchaseOrder, approvePurchaseOrder } = require("../controllers/po");
const {  getAllVendors, getVendorById, generatingVendorCode, getAllVendorsProjectWise } = require("../MongoFunctions/mongoVendorAdd");
const { addCategory, deleteCategory, getCategory, addSubCategory, deleteSubCategory , getSubCategory, addProduct, deleteProduct , getProducts, getProductsByCategoryOrSubCategory } = require("../MongoFunctions/mongoProductAdd");
const {  addBlock, addGP, addStore, getGpsOfBlock,  getStoresOfGp,  addLocation, getAllLocation, getBlockOfLocation, getAllLocationWithAllDetails, getAllGpsOfProject, getBlockOfLocationByGpId } = require("../MongoFunctions/mongoProjectAdd");
const { uploadToS3 } = require("../utility/uploadToS3");
const { downloadFromS3 } = require("../utility/downloadFromS3");
const { createMaterialIssueNote, getAllMIN, getMINByProjectId, getVendorWiseMIN, getSingleMIN, getLatestMinRelatedToMrn } = require("../controllers/materialIssueNotes");
const { createQuotation, getAllQuotationOfProject, getQuotationWithPr, getQuotationById } = require("../controllers/quotation");
const { updateProjectExcelBom, updateProjectExcelBoq } = require("../controllers/excelUploadInBom");
const { workOrderMail } = require("../middleware/workOrderMailer");
const { createWorkOrder, getAllWorkOrder, getWorkOrderById, getWorkOrderByProjectId, updateWorkOrder, editWorkOrder,approveWorkOrder } = require("../controllers/workOrder");
const { getScopeOfWork, getPriceBasis, getTaxesAndDuties, getPaymentTerms, getWorkCompSchedule, getKMP, getInspections, getDLP, getSafetyRequirements, getStatutoryRequirements, getOtherTAndC, getGeneral, getOther, getNote, getTransportation, getPerformanceAndTermination, getAllTermAndConditionTemplate, getTermAndConditionTemplate } = require("../controllers/gettermAndConditionsForWorkOrder copy");
const { createScopeOfWork, createPriceBasis, createTaxesAndDuties, createPaymentTerms, createWorkCompSchedule, createKMP, createInspections, createDLP, createSafetyRequirements, createStatutoryRequirements, createOtherTAndC, createGeneral, createOther, createNote, createTransportation, createPerformanceAndTermination, createWorkOrderTermsAndCondition, editWorkOrderTermsAndCondition } = require("../controllers/createtermAndConditionsForWorkOrder");
const { createComparision, getAllComparision, getComparisionWithComparisionId, editComparisionById, getAllApprovedComparision } = require("../controllers/comparision");
const { getAllContractors, generatingContractorCode, getAllContractorsProjectWise } = require("../MongoFunctions/mongoContractorAdd.js");
const { getContractorById } = require("../MongoFunctions/mongoContractorAdd.js");
const {  updateBoqForm,  createBoqFormGpWise, updateBoqFormGpWise, getAllBoqFormOfProjectWise, getAllBoqFormOfGpWise, gpHasABoq } = require("../controllers/boqForm");
const { getAllFullMINForStock, getMrnRelatedToStock, getMrnQuantityForAllProduct, getMrnQuantityForAllProductForVendorWise, getMrnQuantityForAllProductForVendorGpWise, getStockReportGpWise } = require("../controllers/stockReport");
const { sendEmail } = require("../middleware/sendEmailWithMessage");
const { purchaseOrderMail } = require("../middleware/purchaseOrderMailer ");
const { createRoles, createAndEditRoles, getAllRoles, getRolesByRoleNames } = require("../controllers/roles");
const { getItemsForProject } = require("../controllers/project.inventory");
const { createChangePasswordRequest, createChangeEmailRequest } = require("../controllers/forgotPassword");
const { getAllFullMINForStockGpWise } = require("../controllers/stockReportGpWise");
const { enabledDate, getEnabledDate } = require("../controllers/date");
const { createIssue, solveIssue, getAllIssues } = require("../controllers/issues");

// router.post('/register-user',  registerUser);
// router.post('/login-user',  loginUser);
router.post('/all-users',  showAllUsers);
router.post('/edit-usersAndRole',  addRemoveProjectAndRoleFromUser);
// router.post('/update-password', forgotPassword);
router.post('/get-singleUser', getSingleUser);

router.post('/create-project',  createProject);
router.post('/all-project',  allProjects);
router.post('/single-project',  singleProject);
router.post('/user-project', userProject);
router.patch('/add-members',  addMembers);
router.patch('/add-vendors', addVendors);
router.patch('/add-contractors', addContractors);
router.post('/delete-members',  deleteMembers);
router.post('/get-gps-projectWise',  getGpsAssosiatedWithProject);
router.patch('/update-gps-projectWise',  updateGpsWithinProject);

router.post('/create-item',  createItem);
router.patch('/update-item',  updateItem);
router.patch('/delete-item',  deleteItem);
router.post('/get-item',  readItem);
router.post('/get-all-items',  readAllItems); //get id  query se nhi ho pa rhi thi
// router.post('/generate-stock',  readAllItems);
// router.post('/get-stock',  readAllItems);

// Post Gres - category Waste Due to creating mongo below
// router.post('/get-category',  getCategory);
// router.post('/create-category',  createCategory);
// router.post('/create-subcategory',  createSubCategory);
// router.post('/create-subsubcategory',  createSubSubCategory);
// router.post('/create-product',  createStoreItem);
// router.post('/get-products',  getStoreItem);
// router.patch('/delete-product', deleteStoreItem);



router.post('/create-task', createTask);
router.post('/update-taskStatus', updateTaskStatus);
// router.post('/get-allTasks', getTasks);/
// router.post('/get-projectTasksOfUser', getTasksOfUserProjectBasis);
router.post('/get-allTaskOfAProject', getAllTasksOfProject);
router.post('/get-singleTask', getSingleTask);
router.post('/get-userAllTask', getAllTasksOfUser);
router.post('/update-taskCompletion', updateTaskCompletion);
router.post('/update-taskUpdate', updateTaskUpdate);

router.post('/create-indent', createIndent);
router.post('/get-allindents', getAllIndent);
router.post('/get-allprojectindents', getProjectwiseAllIndent);
router.post('/get-userindent', getUserIndent);
router.post('/get-recindent', getRecIndent);
router.post('/get-approved', getApprovedIndent);
router.post('/get-approved-projectwise', getApprovedIndentByProjectId);
router.post('/get-appindent', getAppIndent);
router.patch('/edit-indent', editIndent);
router.post('/get-single-indent', getIndentById);


router.post('/create-minEntry', createMaterialIssueNote);
router.post('/get-all-min', getAllMIN);
router.post('/get-min-projectwise', getMINByProjectId);
router.post('/get-min-vendorwise', getVendorWiseMIN);
router.post('/get-single-min', getSingleMIN);
router.post('/get-latest-min', getLatestMinRelatedToMrn);


//quotation entry
router.post('/create-quotation', createQuotation);
router.post('/get-quotations', getAllQuotationOfProject);
router.post('/get-single-quotation', getQuotationById);
router.post('/get-quotation-table', getQuotationWithPr);
// router.post('/post-bom-excel', uploadToS3.single("excelFile"),  updateProjectExcelBom);
router.post('/post-boq-excel', uploadToS3.single("excelFile"),  updateProjectExcelBoq);
//

router.post('/create-prEntry', createPr);
router.post('/get-prEntry', getAllPr);
router.post('/get-pr-notApproved', getNotApprovedPr);
router.post('/approve-prEntry', getApprovePr);

router.post('/crud-dateEnabled', enabledDate);
router.post('/get-dateEnabled', getEnabledDate);
// grn routes
router.post('/create-grnEntry', createGrn);
router.post('/get-grnEntry', getAllGrn);

// issues apis
router.post('/create-issue', createIssue);
router.post('/solve-issue', solveIssue);
router.post('/get-allIssues', getAllIssues);

router.post('/create-comparision', createComparision);
router.post('/edit-comparision-by-id', editComparisionById);
router.post('/get-all-comparision', getAllComparision);
router.post('/get-all-approved-comparision', getAllApprovedComparision);
router.post('/get-comparision-by-id', getComparisionWithComparisionId);




router.post('/create-mrnEntry', createMrnEntry);
router.post('/get-mrnTable-by-mrnId', getMrnTableByMrnId);
router.post('/get-getMrnRelatedToPo', getMrnRelatedToPo);
router.post('/get-getMrnRelatedToProject', getMrnRelatedToProject);
router.post('/get-singleMrn-by-mrnId', getSingleMRN);

router.post('/get-allItems-projectWise', getItemsForProject);


router.post('/create-mtoEntry', createMtoEntry);
router.post('/get-mtoEntry', getMTO);
router.post('/get-mtoEntryProjectwise', getMTOProjectWise);



router.post(' ', createReturnSiteToStore);
router.post('/create-createReturnableIndent', createReturnableIndentData);



router.post('/create-poEntry', createPoEntry);
router.post('/get-all-poEntry', getAllPo);
router.post('/approve-po', approvePurchaseOrder);
router.post('/get-all-poEntry-by-id', getAllPoByProjectId);
router.post('/update-poStatus', updatePoStatus);
router.post("/update-purchaseOrder", uploadToS3.single('pdfOfPurchaseOrder'), updatePurchaseOrder);



// router.post('/email-workOrder', workOrderMail);



//vedant  Mongo DB Routes

router.post(
  '/postdata',
  uploadToS3.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'pan_front', maxCount: 1 },
    { name: 'aadhaar_front', maxCount: 1 },
    { name: 'aadhaar_back', maxCount: 1 },
    { name: 'copyOfCheque', maxCount: 1 },
    { name: 'attachmentSheet', maxCount: 1 },
    { name: 'attachmentWOCopies', maxCount: 1 },
    { name: 'attachmentCompletionCertificates', maxCount: 1 },
  ]),
  generatingVendorCode
);

router.post(
  '/postContractordata',
  uploadToS3.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'pan_front', maxCount: 1 },
    { name: 'aadhaar_front', maxCount: 1 },
    { name: 'aadhaar_back', maxCount: 1 },
    { name: 'copyOfCheque', maxCount: 1 },
    { name: 'attachmentSheet', maxCount: 1 },
    { name: 'attachmentWOCopies', maxCount: 1 },
    { name: 'attachmentCompletionCertificates', maxCount: 1 },
  ]),
  generatingContractorCode
);



router.post("/get-images-document",downloadFromS3)
  
  router.post("/get-vendor-by-id", getVendorById)
  router.post("/get-contractor-by-id", getContractorById)

  router.post("/get-vendors",getAllVendors)
  router.post("/get-vendors-projectWise",getAllVendorsProjectWise)
  router.post("/get-contractors",getAllContractors)
  router.post("/get-contractors-projectWise",getAllContractorsProjectWise)
  


  router.post("/delete-subcategory", deleteSubCategory);
  router.post("/create-category", addCategory )
  router.post("/delete-category", deleteCategory )
  router.post( "/get-category",getCategory  )
  router.post( "/create-subcategory", addSubCategory  )
  router.post(  "/get-subcategory",  getSubCategory  )
  router.post(  "/create-product",  addProduct  )
  router.post( "/delete-product",  deleteProduct  )
  router.post(  "/get-products",  getProducts  )
  router.post("/get-product-categoryOrsubcategory",  getProductsByCategoryOrSubCategory)
  
  router.post("/create-location", addLocation )
  // router.post("/delete-all-projj", deleteAllDataProject )
  
  router.post("/create-block", addBlock )
  router.post("/create-gp", addGP )
  router.post("/create-store", addStore )
  
  router.post("/get-project", getAllLocation )
  router.post("/get-blocks", getBlockOfLocation )
  router.post("/get-block-from-gp", getBlockOfLocationByGpId )
  router.post("/get-gps", getGpsOfBlock )
  router.post("/get-all-gps", getAllGpsOfProject )
  router.post("/get-stores", getStoresOfGp )
  
  router.post("/get-completeLocations", getAllLocationWithAllDetails )


  // yash workorder routes
  router.post("/create-workOrder", createWorkOrder);
  router.post("/edit-workOrder", editWorkOrder);
  router.post("/approve-workOrder", approveWorkOrder);

  router.post("/update-workOrder", uploadToS3.single('pdfOfWorkOrder'), updateWorkOrder);
  
  router.post("/get-all-workOrder", getAllWorkOrder);
  router.post("/get-workOrder-by-id", getWorkOrderById);
  router.post("/get-workOrderProjectwise", getWorkOrderByProjectId);




  router.post("/create-wo-termsAndConditionTemplate", createWorkOrderTermsAndCondition);
  router.post("/edit-wo-termsAndConditionTemplate", editWorkOrderTermsAndCondition);
  router.post("/get-wo-termsAndConditionTemplate", getAllTermAndConditionTemplate);
  router.post("/get-wo-termsAndConditionTemplate-selectedTemplate", getTermAndConditionTemplate);
  // router.post("/get-wo-scopeOfWork", getScopeOfWork);

  // router.post("/create-wo-scopeOfWork", createScopeOfWork);
  router.post("/get-wo-scopeOfWork", getScopeOfWork);

  router.post("/create-wo-priceBasis", createPriceBasis);
  router.post("/get-wo-priceBasis", getPriceBasis);

  router.post("/create-wo-taxAndDuties", createTaxesAndDuties);
  router.post("/get-wo-taxAndDuties", getTaxesAndDuties);

  router.post("/create-wo-paymentTerms", createPaymentTerms);
  router.post("/get-wo-paymentTerms", getPaymentTerms);

  router.post("/create-wo-completionSchedule", createWorkCompSchedule);
  router.post("/get-wo-completionSchedule", getWorkCompSchedule);

  router.post("/create-wo-keyProcurement", createKMP);
  router.post("/get-wo-keyProcurement", getKMP);

  router.post("/create-wo-inspections", createInspections);
  router.post("/get-wo-inspections", getInspections);

  router.post("/create-wo-defectLiabilityPeriod", createDLP);
  router.post("/get-wo-defectLiabilityPeriod", getDLP);

  router.post("/create-wo-safetyRequirements", createSafetyRequirements);
  router.post("/get-wo-safetyRequirements", getSafetyRequirements);

  router.post("/create-wo-statutoryRequirements", createStatutoryRequirements);
  router.post("/get-wo-statutoryRequirements", getStatutoryRequirements);

  router.post("/create-wo-otherTandC", createOtherTAndC);
  router.post("/get-wo-otherTandC", getOtherTAndC);
  
  router.post("/create-wo-general", createGeneral);
  router.post("/get-wo-general", getGeneral);

  router.post("/create-wo-other", createOther);
  router.post("/get-wo-other", getOther);

  router.post("/create-wo-note", createNote);
  router.post("/get-wo-note", getNote);


  router.post("/create-wo-transportation", createTransportation);
  router.post("/get-wo-transportation", getTransportation);

  router.post("/create-wo-performanceAndTermination", createPerformanceAndTermination);
  router.post("/get-wo-performanceAndTermination", getPerformanceAndTermination);

  // BOQ Form Routes
  // router.post("/create-boqForm", createBoqForm);
  // router.post("/update-boqForm", updateBoqForm);
  router.post("/get-boqForm-by-project", getAllBoqFormOfProjectWise);
  router.post("/get-boqForm-by-gp", getAllBoqFormOfGpWise);
  router.post("/find-boq-gp", gpHasABoq);

  router.post("/create-boqForm-gpWise", createBoqFormGpWise);
  router.post("/update-boqForm-gpWise", updateBoqFormGpWise);


  router.post("/stock-inward-projectWise&itemWise", getMrnRelatedToStock);
  router.post("/stock-outward-projectWise&itemWise", getAllFullMINForStock);
  
  router.post("/stock-report-projectWise&AllItems", getMrnQuantityForAllProduct);
  router.post("/stock-report-vendorWise", getMrnQuantityForAllProductForVendorWise);
  router.post("/stock-report-vendorGpWise", getMrnQuantityForAllProductForVendorGpWise);
  
  router.post("/stock-report-gpWise&AllItems", getStockReportGpWise);
  // router.post("/stock-inward-gpWise&itemWise", getMrnRelatedToStockGpWise);
  router.post("/stock-outward-gpWise&itemWise", getAllFullMINForStockGpWise);

  router.post("/sendEmail", sendEmail);
  router.post("/workOrder-sendEmail", workOrderMail);
  router.post("/purchaseOrder-sendEmail", purchaseOrderMail);

  
  router.post("/create-roles", createAndEditRoles);

  // Requests for Approval
  router.post('/change-password', createChangePasswordRequest );
  router.post('/change-email', createChangeEmailRequest );




module.exports = router