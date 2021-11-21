const Mongoose = require("mongoose");
const userBookingSchema = new Mongoose.Schema({
    user_id: {
        ref: "user",
        required: true,
        type: Mongoose.Schema.Types.ObjectId
    },
    company_id: {
        ref: "company",
        required: true,
        type: Mongoose.Schema.Types.ObjectId
    },
    slot_id: {
        ref: "company.slot._id",
        type: Mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: ["PENDING", "ACTIVE", "PAYMENT"],
        default: "PENDING"
    },
    is_active: {
        default: true,
        type: Boolean
    }
}, {
    timestamps: true
});

const UserBooking = Mongoose.model("user_booking", userBookingSchema);
module.exports = UserBooking;