require("dotenv").config();

// Library Imports
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mongoose = require("mongoose");

// Config
const Config = require("../config");

// Modal Imports
const User = require("../Model/User");
const Company = require("../Model/Company");

const hashPassword = async (password, salt = 10) => {
    try {
        const bcryptSalt = await bcrypt.genSalt(salt);
        const hasedPassword = await bcrypt.hash(password, bcryptSalt);
        return hasedPassword;
    } catch(error) {
        console.log("Hash Password ->", error);
        throw new Error(error);
    }
};

const comparePassword = async (inputPassword, dbPassword) => {
    try {
        return await bcrypt.compare(inputPassword, dbPassword);
    } catch(error) {
        console.log("Compare Password ->", error);
        throw new Error(error);
    }
};

const accessToken = async (payload) => {
    try {
        const JWT_CONFIGURATION = Config?.jwt;
        const { ACCESS_TOKEN_SECRET } = process.env;
        const token = await jwt.sign(payload, ACCESS_TOKEN_SECRET, JWT_CONFIGURATION);
        return token;
    } catch(error) {
        console.log("JWT sign ->", error);
        throw new Error(error);
    }
};

const verifyToken = async (request, response, next) => {
    const { ACCESS_TOKEN_SECRET } = process.env;
    try {
        let accessToken = request.headers['authorization'];
        if(_.isEmpty(accessToken)) {
            return response.status(403).json({message: "Invalid API access", code: 403})
        }
        accessToken = request.headers['authorization'].split(" ")[1];
        request.user_id = await jwt.decode(accessToken)["id"];
        await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch(error) {
        console.log("JWT verify token ->", error);
        if(error.name === "TokenExpiredError") {
            return response.status(403).json({message: "token expired", code: 403});
        }
        return response.status(403).json({message: "Invalid token", code: 403});
    }
    next();
};

const verifyUser = async (request, response, next) => {
    try {
       let userExists = await User.findById(request.user_id).count();
       if(userExists) {
           next();
       } else {
            return response.status(404).json({message: "Invalid url access", code: 404});
       }
    } catch(error) {
        console.log("verify User ->", error);
        return response.status(404).json({message: "Invalid url access", code: 404});
    }
};

const verifyCompany = async (request, response, next) => {
    try {
        let userExists = await Company.findById(request.user_id).count();
        if(userExists) {
            next();
        } else {
            return response.status(404).json({message: "Invalid url access.", code: 404});
        }
    } catch(error) {
        console.log("verify Company ->", error);
        return response.status(404).json({message: "Invalid url access..", code: 404});
    }
};

const validateObjectID = async (request, response, next) => {
    try {
        let requestMethod = _.upperCase(request.method);
        if(requestMethod === "GET" || requestMethod === "DELETE" || requestMethod === "PATCH") {
            let isValid = await Mongoose.Types.ObjectId.isValid(request.params.id);
            if(!isValid) {
                return response.status(406).json({
                    message: "Invalid ID passed",
                    status: 404
                });
            }
        }
    } catch(error) {
        console.log("Validate Object ID ->", error);
    }
    next();
};

module.exports = {
    verifyUser,  
    accessToken,
    verifyToken,
    hashPassword,
    verifyCompany,
    comparePassword,
    validateObjectID
};