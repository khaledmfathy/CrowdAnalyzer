const winston = require("winston");
require("winston-daily-rotate-file");
const config = require("config");

const transports = [];
if (
  config.get("server.environment") === "production" ||
  config.get("server.environment") === "testing"
) {
  transports.push(
    //Log files for catching Errors Only
    new winston.transports.DailyRotateFile(config.get("log.errorFiles")),

    //Log files for combined (all) Logs
    new winston.transports.DailyRotateFile(config.get("log.combinedFiles"))
  );

  //Development Environment
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.simple()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: config.get("log.level"),
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.prettyPrint()
  ),
  transports,
  exitOnError: false,
});

const engagementLogger = winston.createLogger({
  level: config.get("log.level"),
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss A",
    }),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.DailyRotateFile(config.get("log.total_engagements")),
  ],
  exitOnError: false,
});

module.exports = {
  logger: logger,
  engagementLogger: engagementLogger,
};
