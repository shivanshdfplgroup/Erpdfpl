const express = require("express");
const router = express.Router();

const { auth } = require('../middleware/auth');

const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authentication");
const { createForgotPasswordRequest,getForgotPasswordRequests } = require("../controllers/forgotPassword");
const { getAllLogs } = require("../controllers/logs");
const { getRolesByRoleNames, getAllRoles } = require("../controllers/roles");

router.post('/register-user',  registerUser);
router.post('/login-user',  loginUser);
// changed forgot password logic might not need it
router.post('/update-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-request', createForgotPasswordRequest );
router.post('/get-all-requests', getForgotPasswordRequests );
router.post("/get-user-role", getRolesByRoleNames);
router.post("/get-all-roles", getAllRoles);

// get all logs
router.post('/get-all-logs', getAllLogs );

module.exports = router