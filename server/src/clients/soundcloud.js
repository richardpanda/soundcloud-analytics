const axios = require('axios');

const Parser = require('../util/parser');

class SoundCloudClient {
  constructor(clientId) {
    this.clientId = clientId;
  }

  fetchUserProfilePageByUsername(username) {
    const url = `https://soundcloud.com/${username}`;
    return axios.get(url);
  }

  fetchUserProfileByUserId(userId) {
    const url = `http://api.soundcloud.com/users/${userId}?client_id=${this.clientId}`;
    return axios.get(url);
  }

  async fetchUserProfileByUsername(username) {
    try {
      const userProfilePageResponse = await this.fetchUserProfilePageByUsername(username);
      const userId = Parser.extractUserIdFromUserProfileHtml(userProfilePageResponse.data);
      return await this.fetchUserProfileByUserId(userId);
    } catch (e) {
      return e;
    }
  }
}

module.exports = SoundCloudClient;
