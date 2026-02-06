const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const registerRouter = require("../routes/registerRouter");
const user = require("../models/user");
jest.mock("../models/user");

const { setupAuth } = require("./authenticationFixture");
const { setupErrorHandling } = require("./errorHandlingFixture");
const { setupLogging } = require("./loggingFixture");

setupLogging(app, express);

setupAuth(app, passport);

app.use("/register", registerRouter);

setupErrorHandling(app);

describe("POST /register", function () {
  it("receives incorrect properties, responds with 400 error", (done) => {
    request(app)
      .post("/register")
      .type("form")
      .send({ data: "randomvalue" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives an invalid username, responds with 400 error", (done) => {
    request(app)
      .post("/register")
      .type("form")
      .send({
        username: "not a proper email",
        first_name: process.env.TEST_USER_FIRST_NAME,
        last_name: process.env.TEST_USER_LAST_NAME,
        password: process.env.TEST_USER_PW,
      })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives acceptable data, responds with success", (done) => {
    const userData = {
      username: process.env.TEST_USER_NAME,
      first_name: process.env.TEST_USER_FIRST_NAME,
      last_name: process.env.TEST_USER_LAST_NAME,
      password: process.env.TEST_USER_PW,
    };
    user.register.mockResolvedValue();
    request(app)
      .post("/register")
      .type("form")
      .send(userData)
      .expect("Content-type", /json/)
      .expect(200, done);
  });
});
