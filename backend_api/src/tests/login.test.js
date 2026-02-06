const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const loginRouter = require("../routes/loginRouter");
const { setupAuth } = require("./authenticationFixture");
const { setupErrorHandling } = require("./errorHandlingFixture");
const { setupLogging } = require("./loggingFixture");

setupLogging(app, express);

setupAuth(app, passport);

app.use("/login", loginRouter);

setupErrorHandling(app);

describe("POST /login", function () {
  it("receives bad data, responds with 400 error", (done) => {
    request(app)
      .post("/login")
      .type("form")
      .send({ data: "randomvalue" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives incorrect username, responds with 400 error", (done) => {
    request(app)
      .post("/login")
      .type("form")
      .send({ username: "randomname", password: process.env.TEST_USER_PW })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives incorrect password, responds with 400 error", (done) => {
    request(app)
      .post("/login")
      .type("form")
      .send({
        username: process.env.TEST_USER_NAME,
        password: "randompassword",
      })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives correct credentials, responds with success", (done) => {
    request(app)
      .post("/login")
      .type("form")
      .send({
        username: process.env.TEST_USER_NAME,
        password: process.env.TEST_USER_PW,
      })
      .expect("Content-type", /json/)
      .expect(200, done);
  });
});
