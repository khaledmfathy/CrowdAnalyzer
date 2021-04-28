const { logger, AWSHandler } = require("../loaders");
const {
  InteractionEngagement,
} = require("../components/EngagementTracker/model");
const util = require("util");
const config = require("config");

async function _enqueue() {
  try {
    let queueURL = await AWSHandler.getQueueUrl();
    let randObj = new InteractionEngagement();
    await AWSHandler.sendMessage(JSON.stringify(randObj), queueURL);
  } catch (err) {
    logger.error(`Error in enqueue function: ${util.inspect(err)}`);
  }
}

class DataStreaming {
  static _isEnabled = true;
  static async startStreaming() {
    try {
      if (DataStreaming._isEnabled) {
        let min = config.get("stream.minDelay"),
          max = config.get("stream.maxDelay");
        let rand = Math.floor(Math.random() * (max - min + 1) + min);
        await _enqueue();
        setTimeout(DataStreaming.startStreaming, rand * 1000);
      }
    } catch (err) {
      logger.error(`Error in startStreaming function: ${util.inspect(err)}`);
    }
  }

  static async stopStreaming() {
    DataStreaming._isEnabled = false;
  }
}

module.exports = {
  DataStreaming: DataStreaming,
};
