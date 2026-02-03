const request = require("supertest");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;

const loginRouter = require("../routes/loginRouter");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());

const mockUser = {
  id: 1,
  username: process.env.TEST_USER_NAME,
  password: process.env.TEST_USER_PW,
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username === mockUser.username && password === mockUser.password) {
        return done(null, mockUser);
      } else if (username !== mockUser.username) {
        return done(null, false, { message: "Incorrect username" });
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  done(null, mockUser);
});

app.use("/login", loginRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err });
});

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
