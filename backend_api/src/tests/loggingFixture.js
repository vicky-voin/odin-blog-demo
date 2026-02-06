const winston = require("winston");
const expressWinston = require("express-winston");
const { json } = require("express");

exports.setupLogging = (app, express) => {
  app.use(express.urlencoded({ extended: false }));

  expressWinston.responseWhitelist.push("body");
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
    }),
  );
};
