const AWS = require("aws-sdk");
const config = require("config");
const { logger } = require("./log");
const util = require("util");

class AWSHandler {
  static _configSQS = config.get("aws.sqs");

  static initSDK() {
    AWS.config.getCredentials(function (err) {
      if (err) {
        logger.error(`Error in getting AWS credentials: ${err}`);
        return;
      } else {
        logger.info(`AWS SDK initialized with credentials file successfully`);
        AWS.config.update({ region: config.get("aws.region") });
      }
    });
  }

  static async listQueues() {
    const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
    try {
      return await sqs.listQueues({}).promise();
    } catch (err) {
      logger.error(`Error in listQueues Function: ${util.inspect(err)}`);
      throw err;
    }
  }

  static async createQueue(
    QueueName = this._configSQS.QueueName,
    Attributes = this._configSQS.Attributes
  ) {
    const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });
    const params = {
      QueueName: QueueName,
      Attributes: Attributes,
    };
    try {
      let data = await sqs.createQueue(params).promise();
      return data.QueueUrl;
    } catch (err) {
      logger.error(`Error in createQueue Function: ${util.inspect(err)}`);
      throw err;
    }
  }

  static async getQueue() {
    const sqs = new AWS.SQS({ apiVersion: this._configSQS.apiVersion });

    //Checking if Queue already created
    try {
      let queues = await this.listQueues();

      if (queues.QueueUrls && queues.QueueUrls.length > 0) {
        return queues.QueueUrls[0];
      } else {
        return await this.createQueue();
      }
    } catch (err) {
      logger.error(`Error in getQueue Function: ${err}`);
    }
  }
}

module.exports = {
  AWSHandler: AWSHandler,
};
