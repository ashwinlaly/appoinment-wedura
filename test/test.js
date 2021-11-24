const chai = require('chai');
const { app: server } = require('../index');

before(done => {
    server.on("server_init", () => {
        done();
    });
});

describe("", () => {
    require("./users/user-signup.test");
    require("./users/user-signin.test.js");

    require("./company/company-signin.test.js");
    require("./company/company-signup.test.js");
});