require("dotenv").config()

const {
    DB_URL,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    ENVIRONMENT,
    JWT_EXPITY,
} = process.env;

const environment_config = {
    development: {
        db: {
            url: `mongodb://localhost:27017/${DB_NAME}`,
            mongoose: {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        },
        jwt : {
            expiresIn: JWT_EXPITY
        }
    },
    production: {
        db: {
            url: DB_URL,
            mongoose: {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }
        },
        jwt : {
            expiresIn: JWT_EXPITY
        }
    }
};

module.exports = environment_config[ENVIRONMENT];