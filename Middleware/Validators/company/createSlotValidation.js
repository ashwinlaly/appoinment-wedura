const Joi = require("joi");
const _ = require("lodash");

module.exports = ((request, response, next) => {
    const {body} = request;
    const createSlotSchema = Joi.object().keys({
        cost: Joi.number().label("Cost").required(),
        title: Joi.string().label("Title").required().trim(),
        sub_title: Joi.string().label("Sub Title").required().trim(),
        date: Joi.date().greater('now').required().label("Date"),
        description: Joi.string().label("Description").required().trim(),
        starttime: Joi.required().label("Start Time"),
        endtime: Joi.required().label("End Time")
    });
    const result = createSlotSchema.validate(body, {
        abortEarly: false
    });
    if(result.error) {
        const error = result.error.details.map(i => _.replace(_.replace(i.message, '"', ''), '"', '') );
        return response.status(422).json({
            error,
            code: 422,
            message: "Invalid slot data submitted",
        });
    }
    next();
});