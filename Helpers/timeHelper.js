const Moment = require("moment");
const DATE_FORMAT = "YYYY-MM-DD";

class Time {
    isValidDate(date) {
        try {
            let validDate = Moment(date, DATE_FORMAT);
            return Moment(validDate).isValid();
        } catch(error){
            console.log(error);
            throw new Error("Invalid Date Provided");
        }
    }

    isValidTime(time) {
        try {
            return Moment(time, "H:mm").isValid();
        } catch(error){
            console.log(error);
            throw new Error("Invalid time Provided");
        }
    }

    dateTimeToUnix(date, time) {
        try {
            if(this.isValidTime(time) && this.isValidDate(date)) {
                return Moment(date+' '+time).unix();
            }
        } catch(error) {
            console.log(error);
            throw new Error("Invalid time Provided");
        }
    }
};

module.exports = new Time();