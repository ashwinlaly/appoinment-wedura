// Imports
const _ = require("lodash");
const Mongoose = require("mongoose");

// Modal
const User = require("../Model/User");
const Company = require("../Model/Company");
const UserBooking = require("../Model/UserBooking");

// Helpers
const {
    accessToken,
    hashPassword,
    comparePassword,
} = require("../Helpers/authHelper");

const BOOKING_STATUS = ["PENDING", "ACTIVE", "PAYMENT"];

const SignIn = async (request, response) => {
    const {email, password} = request.body;
    const userData = await User.findOne({email}).exec();
    if(!_.isEmpty(userData)) {
        const isValid = await comparePassword(password, userData.password);
        if(isValid) {
            const token = await accessToken({id: userData._id, email});
            await User.updateOne({id: userData._id}, {
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
    const userData = await User.findOne({email}).exec();
    if(_.isEmpty(userData)) {
        const user = new User;
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.is_active = true;
        user.password = await hashPassword(password);
        await user.save(error => {
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

const searchSlot = async (request, response) => {
    const searchString = request.query.search;
    const data = await Company.aggregate([
        { $unwind: {"path": "$slot"} },
        { $match: {"slot.title": {'$regex': new RegExp(searchString, 'i')}, is_active: true} },
        { $project: {password: 0, is_active: 0, createdAt: 0, updatedAt: 0, token: 0, __v: 0, _id: 0} },
        { $limit: 10 }
    ]).exec();
    return response.status(200).json({data, code: 200, message: "Listing slots"});
};

const createAppointment = async (request, response) => {
    const {
        slot_id,
    } = request.body;
    const user_id = request.user_id;
    const slotInformation = await Company.aggregate([
        { $unwind: {"path": "$slot"} },
        { $match: {"slot._id": Mongoose.Types.ObjectId(slot_id)} },
        { $project: { _id: 1} }
    ]).exec();
    if(!_.isEmpty(slotInformation)) {
        const user_booking = await UserBooking.find({ user_id, slot_id }).exec();
        if(_.isEmpty(user_booking)) {
            let userBooking = new UserBooking();
            userBooking.user_id = user_id;
            userBooking.slot_id = slot_id;
            userBooking.company_id = slotInformation[0]._id;
            userBooking.save(error => {
                if(error) {
                    return response.status(203).json({code: 203, message: "Invalid slot Information"});
                } else {
                    return response.status(200).json({code: 200, message: "Created successfully"});
                }
            });
        } else {
            return response.status(203).json({code: 203, message: "Already Booked"});
        }
    } else {
        return response.status(203).json({code: 203, message: "Invalid slot Information"});
    }
};

const showBookingHistory = async (request, response) => {
    let {
        status = "PENDING",
        company_id
    } = request.body;
    const skip = _.toInteger(request.query.skip) || 0;
    const limit = _.toInteger(request.query.limit) || 5;
    const user_id = Mongoose.Types.ObjectId(request.user_id);
    company_id = Mongoose.Types.ObjectId(request.body.company_id);
    const data = await UserBooking.aggregate([
        { $match: {status: status, user_id, company_id}},
        { $lookup: {
            from: 'companies',
            foreignField: '_id',
            as: 'slot_information',
            localField: 'company_id', 
        } },
        { $unwind: {path: '$slot_information'} }, 
        { $unwind: {path: '$slot_information.slot'} },
        { $match: { $expr: { $eq: ['$slot_id', '$slot_information.slot._id'] }} },
        { $project: {
            status: 1, 
            createdAt: 1, 
            'slot_information.name': 1, 
            'slot_information.slot': 1, 
            'slot_information.email': 1, 
            'slot_information.phone': 1
        } }, 
        { $skip: skip }, 
        { $limit: limit }
      ]).exec();
    if(_.isEmpty(data)) {
        return response.status(202).json({skip, status, data, code: 202, message: "No more booking"});
    } else {
        return response.status(200).json({skip, status, data, code: 200, message: "Listing slots"});
    }
};

const getAppoinmentData = async (request, response) => {
    const user_id = Mongoose.Types.ObjectId(request.user_id);
    const slot_id = Mongoose.Types.ObjectId(request.params.id);
    const data = await UserBooking.aggregate([
        { $match: {user_id, slot_id}},
        { $lookup: {
            from: 'companies',
            foreignField: '_id',
            as: 'slot_information',
            localField: 'company_id', 
        } },
        { $unwind: {path: '$slot_information'} }, 
        { $unwind: {path: '$slot_information.slot'} },
        { $match: { $expr: { $eq: ['$slot_id', '$slot_information.slot._id'] }} },
        { $project: {
            status: 1, 
            createdAt: 1, 
            'slot_information.name': 1, 
            'slot_information.slot': 1, 
            'slot_information.email': 1, 
            'slot_information.phone': 1
        } }
    ]).exec();
    const count = await UserBooking.findOne({user_id}).count();
    if(_.isEmpty(data)) {
        return response.status(202).json({code: 202, message: "No Booking Done"});
    } else {
        return response.status(200).json({data, count, code: 200, message: "Booking data"});
    }
};

const updateAppointmentStatus = async (request, response) => {
    const { status } = request.body;
    const user_id = Mongoose.Types.ObjectId(request.user_id);
    const slot_id = Mongoose.Types.ObjectId(request.params.id);
    if(_.includes(BOOKING_STATUS, _.toUpper(status))) {
        const bookingUpdate = await UserBooking.findOneAndUpdate({ user_id, slot_id}, {status}).exec();
        return response.status(200).json({code: 200, message: "Status updated successfully"});
    } else {
        return response.status(202).json({code: 202, message: "Invalid status provided"});
    }
};

const userBookingHistory = async (user_id, company_id) => {
    const data = await UserBooking.aggregate([
        { $match: {user_id, company_id}},
        { $lookup: {
            from: 'companies',
            foreignField: '_id',
            as: 'slot_information',
            localField: 'company_id', 
        } },
        { $unwind: {path: '$slot_information'} }, 
        { $unwind: {path: '$slot_information.slot'} },
        { $match: { $expr: { $eq: ['$slot_id', '$slot_information.slot._id'] }} },
        { $project: {
            status: 1, 
            createdAt: 1, 
            'slot_information.name': 1, 
            'slot_information.slot': 1, 
            'slot_information.email': 1, 
            'slot_information.phone': 1
        } }
    ]).exec();
    return data;
}

module.exports = {
    SignIn,
    SignUp,
    searchSlot,
    getAppoinmentData,
    createAppointment,
    showBookingHistory,
    updateAppointmentStatus
};