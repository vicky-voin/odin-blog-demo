const passport = require("passport");

exports.processLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: "Could not authenticate user" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ status: "Authentication successful" });
    });
  })(req, res, next);
};
