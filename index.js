const express = require("express");
const config = require("config");
const { logger, AWSHandler } = require("./loaders");
const { DataStreaming } = require("./jobs/DataStreaming");
const {
  EngagementTrackerRouter,
} = require("./components/EngagementTracker/route");

const app = express();

app.use("/api/engagement", EngagementTrackerRouter);

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
  await DataStreaming.startStreaming();
}

init();

module.exports = app;
