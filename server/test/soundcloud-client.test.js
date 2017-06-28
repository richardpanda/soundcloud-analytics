const nock = require('nock');

const { id, permalink } = require('./fake-data/user');
const { readUserProfilePage } = require('./util/file-reader');
const SoundCloudClient = require('../src/clients/soundcloud');
const { clientId } = require('../src/config/soundcloud');

const soundCloudClient = new SoundCloudClient(clientId);

describe('SoundCloud client tests', () => {
  test('fetch user profile by user id', async () => {
    expect.assertions(1);

    nock('http://api.soundcloud.com')
      .get(`/users/${id}`)
      .query({ client_id: clientId })
      .reply(200);

    await expect(soundCloudClient.fetchUserProfileByUserId(id)).resolves.toBeDefined();
  });

  test('fetch user profile page by user permalink', async () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${permalink}`)
      .reply(200);

    await expect(soundCloudClient.fetchUserProfilePageByUserPermalink(permalink)).resolves.toBeDefined();
  });

  test('fetch user profile by user permalink', async () => {
    expect.assertions(1);

    const userProfilePage = await readUserProfilePage();

    nock('https://soundcloud.com')
      .get(`/${permalink}`)
      .reply(200, userProfilePage);

    nock('http://api.soundcloud.com')
      .get(`/users/${id}`)
      .query({ client_id: clientId })
      .reply(200);

    await expect(soundCloudClient.fetchUserProfileByUserPermalink(permalink)).resolves.toBeDefined();
  });
});
