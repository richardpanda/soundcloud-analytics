import nock from 'nock';

import { id, permalink } from '../data/users/justintimberlake/user';
import { readUserProfilePage } from '../utils/file-reader';
import { soundCloudClient } from '../../src/clients';

const clientId = process.env.SOUNDCLOUD_CLIENT_ID;

describe('SoundCloud client tests', () => {
  afterEach(() => {
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
      .get(`/users/${id}`)
      .query({ client_id: clientId })
      .reply(404);

    await expect(soundCloudClient.fetchUserProfileByUserId(id))
      .rejects
      .toEqual({
        name: 'UserProfilePageNotFound',
        message: 'Unable to find user profile page.',
        status: 404,
      });
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
      .get(`/${permalink}`)
      .reply(404);

    await expect(soundCloudClient.fetchUserProfilePageByUserPermalink(permalink))
      .rejects
      .toEqual({
        name: 'UserProfilePageNotFound',
        message: 'Unable to find user profile page.',
        status: 404,
      });
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
