const express = require("express");
const passport = require("passport");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("../lib/prisma.js");
const expressSession = require("express-session");
const userModel = require("./models/user");

const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter.js");

const app = express();

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.getWithEmail(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.getWithId(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(express.urlencoded({ extended: false }));

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.get("/logout", logoutRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }

  console.log("app listening on port 3000");
});
