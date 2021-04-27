const faker = require("faker");

class InteractionEngagement {
  id;
  organization_id;
  type;
  source;
  link;
  username;
  engagements;

  constructor() {
    this.id = faker.datatype.number({ min: 34655948135 });
    this.organization_id = require("mongoose").Types.ObjectId();
    this.type = "post";
    this.source = "facebook";
    this.link = "https://facebook.com/fake-post";
    this.username = faker.internet.userName();
    this.engagements = {
      likes: faker.datatype.number(),
      love: faker.datatype.number(),
      haha: faker.datatype.number(),
      angry: faker.datatype.number(),
    };
  }
}

class OrganizationSettings {
  _id;
  organization_id;
  organization_category;
  options;

  constructor() {
    this._id = require("mongoose").Types.ObjectId();
    this.organization_id = require("mongoose").Types.ObjectId();
    this.organization_category = "@org-categories/researcher";
    this.options = {
      track_engagements: faker.datatype.boolean(),
      track_daily_visits: faker.datatype.boolean(),
      track_quota_consumption: faker.datatype.boolean(),
      track_reports_clicks: faker.datatype.boolean(),
    };
  }
}

module.exports = {
  InteractionEngagement: InteractionEngagement,
  OrganizationSettings: OrganizationSettings,
};
