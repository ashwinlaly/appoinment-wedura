require("dotenv").config();

const db = require("./db");
const {app} = require("./app");
const Constant = require("./constant");

const {
    PORT
} = process.env || 5000;

db.connect((status) => {
    if(Constant.CONNETION_SUCCESS === status) {
        app.listen(PORT, () => {
            console.log(`Application started, running on port - ${PORT}`);
        });
    } else {
        process.exit();
    }
});