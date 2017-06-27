const fs = require('fs');
const nock = require('nock');

const { id, username } = require('./fake-data/user');
const SoundCloudClient = require('../src/clients/soundcloud');
const { clientId } = require('../src/config/soundcloud');

const soundCloudClient = new SoundCloudClient(clientId);

describe('SoundCloud client tests', () => {
  test('fetch user profile by user id', () => {
    expect.assertions(1);

    nock('http://api.soundcloud.com')
      .get(`/users/${id}`)
      .query({ client_id: clientId })
      .reply(200);

    return expect(soundCloudClient.fetchUserProfileByUserId(id)).resolves.toBeDefined();
  });

  test('fetch user profile page by username', () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${username}`)
      .reply(200);

    return expect(soundCloudClient.fetchUserProfilePageByUsername(username)).resolves.toBeDefined();
  });

  test('fetch user profile by username', () => {
    fs.readFile('./test/fake-data/user-profile-page.html', 'utf8', (err, userProfilePage) => {
      expect.assertions(1);

      nock('https://soundcloud.com')
        .get(`/${username}`)
        .reply(200, userProfilePage);

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: clientId })
        .reply(200);

      return expect(soundCloudClient.fetchUserProfileByUsername(username)).resolves.toBeDefined();
    });
  });
});
