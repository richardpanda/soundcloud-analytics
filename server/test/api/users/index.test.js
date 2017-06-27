const elasticsearch = require('elasticsearch');
const fs = require('fs');
const nock = require('nock');
const request = require('supertest');

const app = require('../../../src/app');
const config = require('../../../src/config');
const userProfileResponse = require('../../fake-data/user-profile-response');

const elasticsearchClient = elasticsearch.Client({
  host: config.elasticsearch.host,
});
const { index } = config.elasticsearch;
const soundCloudClientId = config.soundcloud.clientId;
const soundCloudUserId = '69257219';
const soundCloudUsername = 'nghtmre';

describe('Users API tests', () => {
  describe('POST /api/users', () => {
    beforeEach(async () => {
      try {
        const isIndexExists = await elasticsearchClient.indices.exists({ index });
        if (isIndexExists) {
          await elasticsearchClient.indices.delete({ index });
        }
        return;
      } catch (e) {
        return e;
      }
    });

    test('create SoundCloud user', (done) => {
      fs.readFile('./test/fake-data/user-profile.html', 'utf8', (err, userProfileHtml) => {
        nock('https://soundcloud.com')
          .get(`/${soundCloudUsername}`)
          .reply(200, userProfileHtml)

        nock('http://api.soundcloud.com')
          .get(`/users/${soundCloudUserId}`)
          .query({ client_id: soundCloudClientId })
          .reply(200, userProfileResponse);

        request(app)
          .post('/api/users')
          .send({ username: soundCloudUsername })
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });
});
