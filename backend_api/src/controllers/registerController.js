const user = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

const validateUserData = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty")
    .isAlpha()
    .withMessage("Frist name must only contain alphabet characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("First name must be between 1 and 255 characters long"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .isAlpha()
    .withMessage("Last name must only contain alphabet characters")
    .isLength({ min: 1, max: 255 })
    .withMessage("Last name must be between 1 and 255 characters long"),
  body("username")
    .trim()
    .isEmail()
    .withMessage("Username must be a valid email"),
  body("password")
    .trim()
    .isStrongPassword({
      minSymbols: 0,
    })
    .withMessage(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    ),
];

exports.processRegistration = [
  validateUserData,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let userData = matchedData(req);

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      await user.register({
        name: userData.first_name + " " + userData.last_name,
        email: userData.username,
        password: userData.password,
      });

      res.status(200).json({ status: "Successfully registered user" });
    } catch (err) {
      next(err);
    }
  },
];
