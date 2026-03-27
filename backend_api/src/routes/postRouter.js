const { Router } = require("express");
const { createPost } = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/", createPost);

module.exports = postRouter;
