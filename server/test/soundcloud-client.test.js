const nock = require('nock');

const { id, invalidId, invalidPermalink, permalink } = require('./fake-data/user');
const { readUserProfilePage } = require('./util/file-reader');
const SoundCloudClient = require('../src/clients/soundcloud');
const { clientId } = require('../src/config/soundcloud');

const soundCloudClient = new SoundCloudClient(clientId);

describe('SoundCloud client tests', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('fetch user profile by user id', async () => {
    expect.assertions(1);

    nock('http://api.soundcloud.com')
      .get(`/users/${id}`)
      .query({ client_id: clientId })
      .reply(200);

    await expect(soundCloudClient.fetchUserProfileByUserId(id))
      .resolves
      .toBeDefined();
  });

  test('fetch user profile with an invalid user id', async () => {
    expect.assertions(1);

    nock('http://api.soundcloud.com')
      .get(`/users/${invalidId}`)
      .query({ client_id: clientId })
      .reply(404);

    await expect(soundCloudClient.fetchUserProfileByUserId(invalidId))
      .rejects
      .toEqual(new Error('User profile page not found.'));
  });

  test('fetch user profile page by user permalink', async () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${permalink}`)
      .reply(200);

    await expect(soundCloudClient.fetchUserProfilePageByUserPermalink(permalink))
      .resolves
      .toBeDefined();
  });

  test('fetch user profile with an invalid user permalink', async () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${invalidPermalink}`)
      .reply(404);

    await expect(soundCloudClient.fetchUserProfilePageByUserPermalink(permalink))
      .rejects
      .toEqual(new Error('User profile page not found.'));
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

    await expect(soundCloudClient.fetchUserProfileByUserPermalink(permalink))
      .resolves
      .toBeDefined();
  });
});
