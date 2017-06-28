const nock = require('nock');
const request = require('supertest');

const { id, permalink } = require('../../fake-data/user');
const userProfileResponse = require('../../fake-data/user-profile-response');
const { readUserProfilePage } = require('../../util/file-reader');
const app = require('../../../src/app');
const config = require('../../../src/config');
const elasticsearchClient = require('../../../src/clients/elasticsearch');

const { index } = config.elasticsearch;
const soundCloudClientId = config.soundcloud.clientId;

describe('Users API tests', () => {
  describe('POST /api/users', () => {
    beforeEach(async () => {
      nock.cleanAll();
      const isIndexExists = await elasticsearchClient.indices.exists({ index });
      if (isIndexExists) {
        await elasticsearchClient.indices.delete({ index });
      }
    });

    test('create SoundCloud user', async (done) => {
      expect.assertions(4);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage)

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: soundCloudClientId })
        .reply(200, userProfileResponse);

      request(app)
        .post('/api/users')
        .send({ permalink })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.status).toEqual(200);
          expect(res.body.permalink).toEqual(permalink);
          expect(res.body.username).toEqual(userProfileResponse.username);
          done();
        });
    });

    test('request body must contain permalink', (done) => {
      expect.assertions(3);

      request(app)
        .post('/api/users')
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.status).toEqual(400);
          expect(res.body.message).toEqual('Permalink is missing.');
          done();
        });
    });

    test('prevent creating duplicate users', async (done) => {
      expect.assertions(5);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage)

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: soundCloudClientId })
        .reply(200, userProfileResponse);

      request(app)
        .post('/api/users')
        .send({ permalink })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.status).toEqual(200);

          request(app)
            .post('/api/users')
            .send({ permalink })
            .end((err, res) => {
              expect(err).toBeNull();
              expect(res.status).toEqual(400);
              expect(res.body.message).toEqual('User already exists.');
              done();
            });
        });
    });
  });
});
