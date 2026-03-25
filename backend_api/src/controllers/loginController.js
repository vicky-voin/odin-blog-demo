const passport = require("passport");
var jwt = require("jsonwebtoken");

exports.processLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.error("Error: could not authenticate");
      return res.status(400).json({ error: "Could not authenticate user" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      var token = jwt.sign(user.username, process.env.JWT_SECRET);

      return res
        .status(200)
        .json({ status: "Authentication successful", token: token });
    });
  })(req, res, next);
};
