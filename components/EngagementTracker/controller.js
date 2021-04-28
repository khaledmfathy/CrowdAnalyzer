const { logger, AWSHandler } = require("../../loaders");
const util = require("util");
const { Helper } = require("../../utils/Helper");
const { EngagementTrackerService } = require("./service");
const config = require("config");

async function _dequeue() {
  try {
    let result = [];
    let promises = [];
    let queueURL = await AWSHandler.getQueueUrl();
    let data = await AWSHandler.receiveMessage(queueURL);
    if (data && Array.isArray(data)) {
      for (const message of data) {
        result.push(JSON.parse(Helper.escapeCharactersFormatter(message.Body)));
        promises.push(
          AWSHandler.deleteMessage(queueURL, message.ReceiptHandle)
        );
      }
    }
    await Promise.all(promises);
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

async function _enqueue(msgObj) {
  //Push Enriched Object to Another SQS
  let enrichedSQSURL = await AWSHandler.getQueueUrl(
    config.get("aws.sqs.EnrichedQueue")
  );
  await AWSHandler.sendMessage(JSON.stringify(msgObj), enrichedSQSURL);
  return msgObj;
}

class EngagementTrackerController {
  static async track(req, res) {
    try {
      logger.info(`Start Tracking Function`);
      let result = [];
      let promises = [];
      //Consume the captured online conversations from an Amazon SQS queue.
      let receivedMsgs = await _dequeue();

      //Check if organization's settings has enabled track engagements.
      for (let msgObj of receivedMsgs) {
        let orgSettings = EngagementTrackerService.getOrganizationSettings(
          msgObj.organization_id
        );
        if (orgSettings.options.track_engagements) {
          //Enrich conversation with track engagements.
          msgObj = _enrichTotalEngagements(msgObj);
          promises.push(_enqueue(msgObj));
        } else {
          result.push(msgObj);
        }
      }
      result.push(...(await Promise.all(promises)));
      logger.info(`Finish Tracking Function`);
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
