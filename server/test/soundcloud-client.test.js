const fs = require('fs');
const nock = require('nock');

const SoundCloudClient = require('../src/clients/soundcloud');

const soundCloudClientId = '12345';
const soundCloudUserId = '69257219';
const soundCloudUsername = 'nghtmre';
const soundCloudClient = new SoundCloudClient(soundCloudClientId);

describe('SoundCloud client tests', () => {
  test('fetch user profile by user id', () => {
    expect.assertions(1);

    nock('http://api.soundcloud.com')
      .get(`/users/${soundCloudUserId}`)
      .query({ client_id: soundCloudClientId })
      .reply(200);

    return expect(soundCloudClient.fetchUserProfileByUserId(soundCloudUserId)).resolves.toBeDefined();
  });

  test('fetch user profile page by username', () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${soundCloudUsername}`)
      .reply(200);

    return expect(soundCloudClient.fetchUserProfilePageByUsername(soundCloudUsername)).resolves.toBeDefined();
  });

  test('fetch user profile by username', () => {
    fs.readFile('./test/fake-data/user-profile-page.html', 'utf8', (err, userProfilePage) => {
      expect.assertions(1);

      nock('https://soundcloud.com')
        .get(`/${soundCloudUsername}`)
        .reply(200, userProfilePage);

      nock('http://api.soundcloud.com')
        .get(`/users/${soundCloudUserId}`)
        .query({ client_id: soundCloudClientId })
        .reply(200);

      return expect(soundCloudClient.fetchUserProfileByUsername(soundCloudUsername)).resolves.toBeDefined();
    });
  });
});
