const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require('../../index');
const should = chai.should();

chai.use(chaiHttp);
describe("Company Signin -> ", () => {
    it("Submit sign in without post data", (done) => {
        chai.request(server)
            .post("/api/company/signin")
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                done();
            });
    });

    it("Submit sign in without email", (done) => {
        let data = {
            email: "company@test.com"
        };
        chai.request(server)
            .post("/api/company/signin")
            .send(data)
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                response.body.error.should.be.a('array');
                done();
            });
    });

    it("Submit sign in without password", (done) => {
        let data = {
            password: "12345678"
        };
        chai.request(server)
            .post("/api/company/signin")
            .send(data)
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                response.body.error.should.be.a('array');
                done();
            });
    });

    it("Submit invalid input user", (done) => {
        let data = {
            email: "company@test123.com", 
            password: "12345612378"
        };
        chai.request(server)
            .post("/api/company/signin")
            .send(data)
            .end((error, response) => {
                response.should.have.status(406);
                response.body.should.have.property('message');
                response.body.message.should.eql('Invalid credentials');
                done();
            });
    });

    it("Submit sign in with correct post data", (done) => {
        let data = {
            email: "company@test.com", 
            password: "12345678"
        };
        chai.request(server)
            .post("/api/company/signin")
            .send(data)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('token');
                done();
            });
    });
});