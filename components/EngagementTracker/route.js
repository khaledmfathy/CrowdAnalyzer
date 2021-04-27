const express = require("express");
const router = express.Router();

const { EngagementTrackerController } = require("./controller");

router.post("/track", EngagementTrackerController.track);

module.exports = {
  EngagementTrackerRouter: router,
};
