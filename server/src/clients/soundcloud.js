const axios = require('axios');

class SoundCloudClient {
  constructor(clientId) {
    this.clientId = clientId;
  }

  fetchUserPageByUserName(userName) {
    const url = `https://soundcloud.com/${userName}`;
    return axios.get(url);
  }

  fetchUserProfileByUserId(userId) {
    const url = `http://api.soundcloud.com/users/${userId}?client_id=${this.clientId}`;
    return axios.get(url);
  }
}

module.exports = SoundCloudClient;
