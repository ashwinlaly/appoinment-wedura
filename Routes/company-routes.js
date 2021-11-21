const express = require("express");
const companyRoutes = express.Router();

const {
    verifyToken,
    verifyCompany
} = require("../Helpers/authHelper");

const companyController = require("../Controller/companyController");

const signinValidator = require("../Middleware/Validators/company/signinValidator");
const signupValidator = require("../Middleware/Validators/company/signupValidator");
const createSlotValidation = require("../Middleware/Validators/company/createSlotValidation");

module.exports = (() => {
    companyRoutes.post("/signin", [signinValidator], companyController.SignIn);
    companyRoutes.post("/signup", [signupValidator], companyController.SignUp);

    companyRoutes.use("*", [verifyToken, verifyCompany]);
    companyRoutes.post("/slot", [createSlotValidation], companyController.createSlot);
    return companyRoutes;
});