const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema({
    name: {
        min: 4,
        max: 30,
        trim: true,
        type: String,
        required: true
    },
    email: {
        min: 6,
        max: 50,
        trim: true,
        type: String,
        required: true
    },
    password: {
        min: 6,
        max: 50,
        trim: true,
        type: String,
        required: true
    },
    phone: {
        min: 10,
        max: 15,
        trim: true,
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

const User = Mongoose.model("user", userSchema);
module.exports = User;