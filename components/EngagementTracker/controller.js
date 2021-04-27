const { logger, AWSHandler } = require("../../loaders");
const util = require("util");

function _escapeCharactersFormatter(data) {
  data = data.replace('"{', "{");
  data = data.replace(/\\"/g, '"');
  data = data.replace('}"', "}");
  return data;
}

async function _dequeue() {
  try {
    let result = [];
    let queueURL = await AWSHandler.getQueue();
    let data = await AWSHandler.receiveMessage(queueURL);
    if (data && Array.isArray(data)) {
      for (const message of data) {
        result.push(JSON.parse(_escapeCharactersFormatter(message.Body)));
        await AWSHandler.deleteMessage(queueURL, message.ReceiptHandle);
      }
    }
    return result;
  } catch (err) {
    logger.error(`Error in dequeue function: ${util.inspect(err)}`);
    throw err;
  }
}

class EngagementTrackerController {
  static async track(req, res) {
    try {
      logger.info(`Start Tracking Function`);
      let result = await _dequeue();
      res.status(200).json(result);
    } catch (err) {
      logger.error(`Error in track function: ${util.inspect(err)}`);
      res.status(400).json({
        message: "Error in consuming service. Check logs for more details.",
      });
    }
  }
}

module.exports = {
  EngagementTrackerController: EngagementTrackerController,
};
