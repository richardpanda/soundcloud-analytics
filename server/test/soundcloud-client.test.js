const fs = require('fs');
const nock = require('nock');

const { id, permalink } = require('./fake-data/user');
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

  test('fetch user profile page by user permalink', () => {
    expect.assertions(1);

    nock('https://soundcloud.com')
      .get(`/${permalink}`)
      .reply(200);

    return expect(soundCloudClient.fetchUserProfilePageByUserPermalink(permalink)).resolves.toBeDefined();
  });

  test('fetch user profile by user permalink', (done) => {
    expect.assertions(1);

    fs.readFile('./test/fake-data/user-profile-page.html', 'utf8', (err, userProfilePage) => {
      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage);

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: clientId })
        .reply(200);

      soundCloudClient.fetchUserProfileByUserPermalink(permalink)
        .then((userProfile) => {
          expect(userProfile).toBeDefined();
          done();
        })
        .catch(done);
    });
  });
});
