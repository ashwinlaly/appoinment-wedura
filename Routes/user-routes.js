const express = require("express");
const userRoutes = express.Router();

const {
    verifyUser,
    verifyToken
} = require("../Helpers/authHelper");

const userController = require("../Controller/userController");

const signValidator = require("../Middleware/Validators/users/signinValidator");
const signupValidator = require("../Middleware/Validators/users/signupValidator");

module.exports = (() => {
    userRoutes.post("/signin", [signValidator], userController.SignIn);
    userRoutes.post("/signup", [signupValidator], userController.SignUp);

    userRoutes.use("*", [verifyToken, verifyUser])
    userRoutes.post("/slot/search", userController.searchSlot);
    userRoutes.post("/appointment", userController.createAppointment);
    userRoutes.get("/appointment/history", userController.showBookingHistory);
    userRoutes.put("/appointment/status/:id", userController.updateAppointmentStatus);
    return userRoutes;
});