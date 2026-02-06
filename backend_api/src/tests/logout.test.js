const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");

const logoutRouter = require("../routes/logoutRouter");
const { setupAuth, loginTestUser } = require("./authenticationFixture");
const { setupErrorHandling } = require("./errorHandlingFixture");
const { setupLogging } = require("./loggingFixture");

setupLogging(app, express);

setupAuth(app, passport);

app.use("/logout", logoutRouter);

setupErrorHandling(app);

const user = request.agent(app);

describe("POST /logout", function () {
  it("user is not logged in, responds with 401 error", (done) => {
    request(app)
      .post("/logout")
      .send()
      .expect("Content-type", /json/)
      .expect(401, done);
  });

  it("user is logged in, is logged out successfully", (done) => {
    loginTestUser(user, () => {
      user
        .post("/logout")
        .send()
        .expect("Content-type", /json/)
        .expect(200, done);
    });
  });
});
