const Joi = require("joi");
const _ = require("lodash");

module.exports = ((request, response, next) => {
    const {body} = request;
    const userSigninSchema = Joi.object().keys({
        email: Joi.string().label("Email").required().email(),
        password: Joi.string().label("Password").min(8).max(30).required().trim()
    });
    const result = userSigninSchema.validate(body, {
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