const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require('../../index');
const should = chai.should();

chai.use(chaiHttp);
describe("User Signup -> ", () => {
    it("Submit sign up without post data", (done) => {
        chai.request(server)
            .post("/api/user/signup")
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                done();
            });
    });
});