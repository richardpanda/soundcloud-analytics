const nock = require('nock');

const SoundCloudClient = require('../src/clients/soundcloud');

const soundCloudClientId = '12345';
const soundCloudUserId = '123';
const soundCloudUserName = 'test';
const soundCloudClient = new SoundCloudClient(soundCloudClientId);

describe('SoundCloud client tests', () => {
  test('fetch user profile', () => {
    nock('http://api.soundcloud.com')
      .get(`/users/${soundCloudUserId}`)
      .query({ client_id: soundCloudClientId })
      .reply(200);

    return soundCloudClient.fetchUserProfileByUserId(soundCloudUserId);
  });

  test('fetch user page', () => {
    nock('https://soundcloud.com')
      .get(`/${soundCloudUserName}`)
      .reply(200);

    return soundCloudClient.fetchUserPageByUserName(soundCloudUserName);
  });
});
