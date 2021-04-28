const AWS = require("aws-sdk");
const config = require("config");
const { logger } = require("./log");
const util = require("util");
const initAmazonSDK = util
  .promisify(AWS.config.getCredentials)
  .bind(AWS.config);

class AWSHandler {
  static _configSQS = config.get("aws.sqs");

  static async initSDK() {
    try {
      await initAmazonSDK();
      logger.info(`AWS SDK initialized with credentials file successfully`);
      AWS.config.update({ region: config.get("aws.region") });
    } catch (err) {
      logger.error(`Error in getting AWS credentials: ${err}`);
    }
  }

  static async getQueueUrl(queueName = this._configSQS.ConvQueue) {
    try {
      const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
      let result = await sqs.getQueueUrl({ QueueName: queueName }).promise();
      return result.QueueUrl;
    } catch (err) {
      logger.info(
        `No Queue available with name: ${queueName}. Creating new one...`
      );
      return await this.createQueue(queueName);
    }
  }

  static async createQueue(
    QueueName = this._configSQS.ConvQueue,
    Attributes = this._configSQS.NewQueueAttributes
  ) {
    const params = {
      QueueName: QueueName,
      Attributes: Attributes,
    };
    try {
      const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
      let data = await sqs.createQueue(params).promise();
      return data.QueueUrl;
    } catch (err) {
      logger.error(`Error in createQueue Function: ${util.inspect(err)}`);
    }
  }

  static async sendMessage(body, queueURL, DelaySeconds = 60) {
    try {
      const params = {
        DelaySeconds: DelaySeconds,
        MessageBody: JSON.stringify(body),
        QueueUrl: queueURL,
      };
      const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
      await sqs.sendMessage(params).promise();
      logger.info(`Message sent to ${queueURL} successfully`);
    } catch (err) {
      logger.error(
        `Error in sending message body to ${util.inspect(
          queueURL
        )}: ${util.inspect(err)}`
      );
    }
  }

  static async receiveMessage(queueURL) {
    try {
      const attributes = this._configSQS.RecieveMsgAttributes;
      let params = {};
      params = Object.assign(params, attributes, { QueueUrl: queueURL });
      const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
      let result = await sqs.receiveMessage(params).promise();
      if (result.Messages) {
        logger.info(`Message Received from ${queueURL} successfully`);
        return result.Messages;
      } else {
        logger.info(`Queue: ${queueURL} is empty.`);
        return;
      }
    } catch (err) {
      logger.error(
        `Error in receiving message body to ${queueURL}: ${util.inspect(err)}`
      );
      throw err;
    }
  }

  static async deleteMessage(queueURL, ReceiptHandle) {
    try {
      let params = { QueueUrl: queueURL, ReceiptHandle: ReceiptHandle };
      const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
      await sqs.deleteMessage(params).promise();
    } catch (err) {
      logger.error(
        `Error in deleting message body to ${queueURL}: ${util.inspect(err)}`
      );
      throw err;
    }
  }
}

module.exports = {
  AWSHandler: AWSHandler,
};
