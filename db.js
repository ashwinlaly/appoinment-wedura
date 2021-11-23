require("dotenv").config();

const Mongoose = require("mongoose");
const Config = require("./config");
const Constant = require("./constant");

module.exports = {
    connect: (callback) => {
        try {
            Mongoose.connect(Config.db.url, Config.db.mongoose, (error, connection) => {
                if(error) {
                    console.log("Database Error...", error);
                    callback(Constant.CONNETION_ERROR);
                } else {
                    _db = connection;
                    console.log("Database connection success...");
                    callback(Constant.CONNETION_SUCCESS);
                }
            });
        } catch(error) {
            console.log("Database Error...", error);
            callback(Constant.CONNETION_ERROR);
        }  
    },
    close: () => {
        Mongoose.disconnect();
    }
};