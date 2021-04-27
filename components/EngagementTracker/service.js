const { OrganizationSettings } = require("./model");
class EngagementTrackerService {
  /* This function stimulate connecting to Organization Tracking Settings Service by
sending organizationID and receives organization settings object.
*/
  static getOrganizationSettings(organizationID) {
    return new OrganizationSettings();
  }
}

module.exports = {
  EngagementTrackerService: EngagementTrackerService,
};
