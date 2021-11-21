const _ = require("lodash");
const Mongoose = require("mongoose");
const Company = require("../Model/Company");
const Time = require("../Helpers/timeHelper");
const {
    accessToken,
    hashPassword,
    comparePassword,
} = require("../Helpers/authHelper");

const SignIn = async (request, response) => {
    const {email, password} = request.body;
    const companyData = await Company.findOne({email}).exec();
    if(!_.isEmpty(companyData)) {
        const isValid = await comparePassword(password, companyData.password);
        if(isValid) {
            const token = await accessToken({id: companyData._id, email});
            await Company.updateOne({id: companyData._id}, {
                $set: {token}
            }).exec();
            return response.status(200).json({code: 200, message: "signin success", token});
        }
    }
    return response.status(406).json({code: 406, message: "Invalid credentials"});
};

const SignUp = async (request, response) => {
    const { name, 
            email,
            phone,
            password,
        } = request.body;
    const companyData = await Company.findOne({email}).exec();
    if(_.isEmpty(companyData)) {
        const company = new Company;
        company.name = name;
        company.email = email;
        company.phone = phone;
        company.is_active = true;
        company.password = await hashPassword(password);
        await company.save(error => {
            if(error) {
                return response.status(406).json({code: 406, message: "signup error", error: error.message});
            } else {
                return response.status(201).json({code: 201, message: "signup success"});
            }
        });
    } else {
        return response.status(406).json({code: 406, message: "Email already exists"});
    }
};

const createSlot = async (request, response) => {
    try {
        const company_id = request.user_id;
        const {
            date,
            cost,
            title,
            endtime,
            starttime,
            sub_title,
            description,
        } = request.body;
        
        let companyRes = await Company.find({_id: company_id, "slot.date": date}).exec();
        if(_.isEmpty(companyRes)) {
            await Company.updateOne({_id: company_id}, {
                $push: { 
                    slot: {
                        date,
                        cost,
                        title,
                        sub_title,
                        endtime: Time.dateTimeToUnix(date, endtime),
                        starttime: Time.dateTimeToUnix(date, starttime),
                        description,
                    }
                }
            }).exec();
            return response.status(200).json({code: 200, message: "Slot created successfully"});
        } else {
            await Company.updateOne({_id: company_id, "slot.date": date}, {
                $set: {
                    "slot.$.date": date,
                    "slot.$.cost": cost,
                    "slot.$.title": title,
                    "slot.$.sub_title": sub_title,
                    "slot.$.description": description,
                    "slot.$.starttime": Time.dateTimeToUnix(date, starttime),
                    "slot.$.endtime": Time.dateTimeToUnix(date, endtime)
                }
            }).exec();
            return response.status(201).json({code: 201, message: "Slot updated successfully"});
        }
    } catch(error) {
        console.log("create slot error ->", error);
        return response.status(406).json({code: 406, message: "Slot creation error"});
    }
};

module.exports = {
    SignIn,
    SignUp,
    createSlot
}