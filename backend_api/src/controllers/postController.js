const { body, validationResult, matchedData } = require("express-validator");
require("dotenv").config();

const validatePostData = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 20000 })
    .withMessage("Exceeded max limit for post size"),
];

exports.createPost = [
  validatePostData,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let postData = matchedData(req);

      //TODO: call post model to create the post in the DB

      res.status(200).json({ status: "Successfully created post" });
    } catch (err) {
      next(err);
    }
  },
];
