const { logger, AWSHandler } = require("../loaders");
const { InteractionEngagement } = require("../utils/DataGeneration");
const util = require("util");
const config = require("config");

async function _enqueue() {
  try {
    let queueURL = await AWSHandler.getQueue();
    let randObj = new InteractionEngagement();
    await AWSHandler.sendMessage(JSON.stringify(randObj), queueURL);
  } catch (err) {
    logger.error(`Error in enqueue function: ${util.inspect(err)}`);
  }
}

class DataStreaming {
  static async startStreaming() {
    try {
      let min = config.get("stream.minDelay"),
        max = config.get("stream.maxDelay");
      let rand = Math.floor(Math.random() * (max - min + 1) + min);
      await _enqueue();
      setTimeout(DataStreaming.startStreaming, rand * 1000);
    } catch (err) {
      logger.error(`Error in startStreaming function: ${util.inspect(err)}`);
    }
  }

  static startConsuming() {}
}

module.exports = {
  DataStreaming: DataStreaming,
};
