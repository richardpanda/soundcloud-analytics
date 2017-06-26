const nock = require('nock');

const SoundCloudClient = require('../src/clients/soundcloud');

describe('SoundCloud client tests', () => {
  test('fetch user profile', () => {
    const soundCloudClientId = '12345';
    const soundCloudUserId = '123';
    const soundCloudClient = new SoundCloudClient(soundCloudClientId);

    nock('http://api.soundcloud.com')
      .get(`/users/${soundCloudUserId}`)
      .query({ client_id: soundCloudClientId })
      .reply(200);

    return soundCloudClient.fetchUserProfile(soundCloudUserId);
  });
});
