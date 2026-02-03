const { Router } = require("express");
const { processLogin } = require("../controllers/loginController");

const loginRouter = Router();

loginRouter.post("/", processLogin);

module.exports = loginRouter;
