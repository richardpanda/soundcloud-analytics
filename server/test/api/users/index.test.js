const fs = require('fs');
const nock = require('nock');
const request = require('supertest');

const app = require('../../../src/app');
const config = require('../../../src/config');
const elasticsearchClient = require('../../../src/clients/elasticsearch');
const { id, permalink } = require('../../fake-data/user');
const userProfileResponse = require('../../fake-data/user-profile-response');

const { index } = config.elasticsearch;
const soundCloudClientId = config.soundcloud.clientId;

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
      expect.assertions(1);

      fs.readFile('./test/fake-data/user-profile-page.html', 'utf8', (err, userProfilePage) => {
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
