const chai = require('chai');
const chaiHttp = require('chai-http');
const { app: server } = require('../../index');
const should = chai.should();

chai.use(chaiHttp);
describe("Company Signup -> ", () => {
    it("Submit sign up without post data", (done) => {
        chai.request(server)
            .post("/api/company/signup")
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                done();
            });
    });

    it("Submit sign up without email", (done) => {
        let data = {
            email: "company@test.com"
        };
        chai.request(server)
            .post("/api/company/signup")
            .send(data)
            .end((error, response) => {
                response.should.have.status(422);
                response.body.should.have.property('error');
                response.body.error.should.be.a('array');
                done();
            });
    });

    it("Submit sign up with correct post data", (done) => {
        let data = {
            name: "test",
            phone: "1234567890",
            password: "12345678",
            email: "yoga@test.com"
        };
        chai.request(server)
            .post("/api/company/signup")
            .send(data)
            .end((error, response) => {
                if(response.status === 406) {
                    response.body.message.should.eql('Email already exists');
                } else {
                    response.should.have.status(201);
                    response.body.message.should.eql('signup success');
                }
                done();
            });
    });
});