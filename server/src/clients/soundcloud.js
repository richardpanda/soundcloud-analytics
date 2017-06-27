const axios = require('axios');

const Parser = require('../util/parser');

class SoundCloudClient {
  constructor(clientId) {
    this.clientId = clientId;
  }

  fetchUserProfileByUserId(userId) {
    const url = `http://api.soundcloud.com/users/${userId}?client_id=${this.clientId}`;
    return axios.get(url);
  }

  fetchUserProfilePageByUserPermalink(permalink) {
    const url = `https://soundcloud.com/${permalink}`;
    return axios.get(url);
  }

  async fetchUserProfileByUserPermalink(permalink) {
    try {
      const userProfilePageResponse = await this.fetchUserProfilePageByUserPermalink(permalink);
      const userId = Parser.extractUserIdFromUserProfilePage(userProfilePageResponse.data);
      return await this.fetchUserProfileByUserId(userId);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = SoundCloudClient;
