const express = require("express");
const config = require("config");
const { logger, AWSHandler } = require("./loaders");

const app = express();

async function startServer() {
  app.listen(config.get("server.port"), (err) => {
    if (err) {
      logger.error(`Error in initializing server: ${err}`);
      return;
    }
    logger.info(
      `
          ###################################################
          🛡️  CrowdAnalyzer Task is up!. Listening on port ${config.get(
            "server.port"
          )}! 🛡️ 
          ###################################################
        `
    );
    logger.info("Currently in Environment: " + app.get("env"));
  });
}

async function init() {
  await startServer();
  await AWSHandler.initSDK();
  // let queueURL = await AWSHandler.getQueue();
  // await AWSHandler.sendMessage({ key: "hello" }, queueURL);
}

init();
