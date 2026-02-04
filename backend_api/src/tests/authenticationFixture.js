const session = require("express-session");
const express = require("express");
const { processLogin } = require("../controllers/loginController");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;

const TEST_LOGIN_ENDPOINT = "/test_login";

exports.setupAuth = (app, passport) => {
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

  //Endpoint for logging in test user
  app.post(TEST_LOGIN_ENDPOINT, processLogin);
};

exports.loginTestUser = (user, done) => {
  user
    .post(TEST_LOGIN_ENDPOINT)
    .type("form")
    .send({
      username: process.env.TEST_USER_NAME,
      password: process.env.TEST_USER_PW,
    })
    .expect("Content-type", /json/)
    .expect(200, done);
};
