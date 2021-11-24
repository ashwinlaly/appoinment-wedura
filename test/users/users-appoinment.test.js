const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require("axios").default;
const { app: server } = require('../../index');
const should = chai.should();

chai.use(chaiHttp);
