const Moment = require("moment");
const Mongoose = require("mongoose");

const companyTrainigSchema = new Mongoose.Schema({
    title: {
        trim: true,
        type: String,
        required: true
    },
    sub_title: {
        trim: true,
        type: String,
        required: true
    },
    description: {
        trim: true,
        type: String,
        required: true
    },
    date : {
        type: Date,
        required: true,
        min: Moment().format("YYYY-MM-DD")
    },
    starttime : {
        trim: true,
        type: Number,
        required: true
    },
    endtime : {
        trim: true,
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    reason: {
        trim: true,
        type: String
    }
});

module.exports = companyTrainigSchema;