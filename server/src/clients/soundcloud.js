const axios = require('axios');

const Parser = require('../util/parser');

class SoundCloudClient {
  constructor(clientId) {
    this.clientId = clientId;
  }

  async fetchUserProfileByUserId(userId) {
    const url = `http://api.soundcloud.com/users/${userId}?client_id=${this.clientId}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw {
        name: 'UserProfilePageNotFound',
        message: 'Unable to find user profile page.',
        status: 404,
      };
    }
  }

  async fetchUserProfilePageByUserPermalink(permalink) {
    const url = `https://soundcloud.com/${permalink}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      throw {
        name: 'UserProfilePageNotFound',
        message: 'Unable to find user profile page.',
        status: 404,
      };
    }
  }

  async fetchUserProfileByUserPermalink(permalink) {
    try {
      const userProfilePage = await this.fetchUserProfilePageByUserPermalink(permalink);
      const userId = Parser.extractUserIdFromUserProfilePage(userProfilePage);
      return await this.fetchUserProfileByUserId(userId);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SoundCloudClient;
