const { Router } = require("express");
const { processLogout } = require("../controllers/logoutController");

const logoutRouter = Router();

logoutRouter.post("/", processLogout);

module.exports = logoutRouter;
