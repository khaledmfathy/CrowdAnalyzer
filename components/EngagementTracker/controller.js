const { logger, AWSHandler } = require("../../loaders");
const util = require("util");
const { Helper } = require("../../utils/Helper");
const { EngagementTrackerService } = require("./service");

async function _dequeue() {
  try {
    let result = [];
    let queueURL = await AWSHandler.getQueue();
    let data = await AWSHandler.receiveMessage(queueURL);
    if (data && Array.isArray(data)) {
      for (const message of data) {
        result.push(JSON.parse(Helper.escapeCharactersFormatter(message.Body)));
        await AWSHandler.deleteMessage(queueURL, message.ReceiptHandle);
      }
    }
    return result;
  } catch (err) {
    logger.error(`Error in dequeue function: ${util.inspect(err)}`);
    throw err;
  }
}

function _enrichTotalEngagements(msgObj) {
  let totalEngagements =
    msgObj.engagements.likes +
    msgObj.engagements.love +
    msgObj.engagements.haha +
    msgObj.engagements.angry;

  msgObj.total_engagements = totalEngagements;
  return msgObj;
}

class EngagementTrackerController {
  static async track(req, res) {
    try {
      logger.info(`Start Tracking Function`);
      let result = [];
      let receivedMsgs = await _dequeue();
      for (let msgObj of receivedMsgs) {
        let orgSettings = EngagementTrackerService.getOrganizationSettings(
          msgObj.organization_id
        );
        if (orgSettings.options.track_engagements) {
          msgObj = _enrichTotalEngagements(msgObj);
        }
        result.push(msgObj);
      }
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
