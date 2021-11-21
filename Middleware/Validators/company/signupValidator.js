const Joi = require("joi");
const _ = require("lodash");

module.exports = ((request, response, next) => {
    const {body} = request;
    const userSignupSchema = Joi.object().keys({
        name: Joi.string().label("Name").required().trim(),
        email: Joi.string().label("Email").required().email().trim(),
        password: Joi.string().label("Password").min(8).max(30).required().trim(),
        phone: Joi.string().required().label("Phone").min(10).trim().pattern(/^[0-9]+$/)
    });
    const result = userSignupSchema.validate(body, {
        abortEarly: false
    });
    if(result.error) {
        const error = result.error.details.map(i => _.replace(_.replace(i.message, '"', ''), '"', '') );
        return response.status(422).json({
            error,
            code: 422,
            message: "Invalid Credentials.",
        });
    }
    next();
});