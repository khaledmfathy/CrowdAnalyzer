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

module.exports = {
  InteractionEngagement: InteractionEngagement,
};
