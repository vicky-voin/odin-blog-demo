const { processLogout } = require("../controllers/logoutController");

const logoutRouter = Router();

logoutRouter.get("/", processLogout);

module.exports = logoutRouter;
