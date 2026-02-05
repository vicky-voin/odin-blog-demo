const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const registerRouter = require("../routes/registerRouter");
const { setupAuth } = require("./authenticationFixture");
const { setupErrorHandling } = require("./errorHandlingFixture");

setupAuth(app, passport);

app.use("/register", registerRouter);

setupErrorHandling(app);

describe("POST /register", function () {
  it("receives bad data, responds with 400 error", (done) => {
    request(app)
      .post("/register")
      .type("form")
      .send({ data: "randomvalue" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  // it("receives correct credentials, responds with success", (done) => {
  //   request(app)
  //     .post("/register")
  //     .type("form")
  //     .send({
  //       username: process.env.TEST_USER_NAME,
  //       password: process.env.TEST_USER_PW,
  //     })
  //     .expect("Content-type", /json/)
  //     .expect(200, done);
  // });
});
