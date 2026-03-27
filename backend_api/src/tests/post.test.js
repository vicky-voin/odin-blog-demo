const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");
require("dotenv").config();

const postRouter = require("../routes/postRouter");
const { setupAuth } = require("./authenticationFixture");
const { setupErrorHandling } = require("./errorHandlingFixture");
const { setupLogging } = require("./loggingFixture");

setupLogging(app, express);

setupAuth(app, passport);

app.use("/post", postRouter);

setupErrorHandling(app);

const VERY_LONG_STRING = "t".repeat(20001);

describe("POST /post", function () {
  it("receives missing required fields, responds with 400 error", (done) => {
    request(app)
      .post("/post")
      .type("form")
      .send({ data: "randomvalue" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives empty title, responds with 400 error", (done) => {
    request(app)
      .post("/post")
      .type("form")
      .send({ title: "", content: "Test content." })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives empty content, responds with 400 error", (done) => {
    request(app)
      .post("/post")
      .type("form")
      .send({ title: "Test title", content: "" })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives content above max limit, responds with 400 error", (done) => {
    request(app)
      .post("/post")
      .type("form")
      .send({ title: "Test title", content: VERY_LONG_STRING })
      .expect("Content-type", /json/)
      .expect(400, done);
  });
  it("receives correct post data, responds with success", (done) => {
    request(app)
      .post("/post")
      .type("form")
      .send({ title: "Test Title", content: "Test content." })
      .expect("Content-type", /json/)
      .expect(200, done);
  });
});
