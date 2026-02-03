const { Router } = require("express");
const { processRegistration } = require("../controllers/registerController");

const registerRouter = Router();

registerRouter.post("/", processRegistration);

module.exports = registerRouter;
