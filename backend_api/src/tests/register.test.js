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

const VERY_LONG_STRING = "t".repeat(256);

describe("POST /register", function () {
  it("receives incorrect properties, responds with 400 error", (done) => {
    request(app)
      .post("/register")
      .type("form")
      .send({ data: "randomvalue" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it.each(["", "123", "test@test"])(
    "receives an invalid username (%s), responds with 400 error",
    async (invalidValue) => {
      request(app)
        .post("/register")
        .type("form")
        .send({
          username: invalidValue,
          first_name: process.env.TEST_USER_FIRST_NAME,
          last_name: process.env.TEST_USER_LAST_NAME,
          password: process.env.TEST_USER_PW,
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end();
    },
  );
  it.each(["", "123", "pw123", "Pw1"])(
    "receives an invalid password (%s), responds with 400 error",
    async (invalidValue) => {
      request(app)
        .post("/register")
        .type("form")
        .send({
          username: process.env.TEST_USER_NAME,
          first_name: process.env.TEST_USER_FIRST_NAME,
          last_name: process.env.TEST_USER_LAST_NAME,
          password: invalidValue,
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end();
    },
  );
  it.each(["", "123", "myname.", VERY_LONG_STRING])(
    "receives an invalid first name (%s), responds with 400 error",
    async (invalidValue) => {
      request(app)
        .post("/register")
        .type("form")
        .send({
          username: process.env.TEST_USER_NAME,
          first_name: invalidValue,
          last_name: process.env.TEST_USER_LAST_NAME,
          password: process.env.TEST_USER_PW,
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end();
    },
  );
  it.each(["", "123", "myname.", VERY_LONG_STRING])(
    "receives an invalid last name (%s), responds with 400 error",
    async (invalidValue) => {
      request(app)
        .post("/register")
        .type("form")
        .send({
          username: process.env.TEST_USER_NAME,
          first_name: process.env.TEST_USER_FIRST_NAME,
          last_name: invalidValue,
          password: process.env.TEST_USER_PW,
        })
        .expect("Content-type", /json/)
        .expect(400)
        .end();
    },
  );
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
