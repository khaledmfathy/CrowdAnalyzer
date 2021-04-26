const logger = require("./log").logger;
const { AWSHandler } = require("./AmazonSQS");

module.exports = {
  logger: logger,
  AWSHandler: AWSHandler,
};
