import nock from 'nock';
import request from 'supertest';

import {
  avatarUrl,
  id,
  invalidPermalink,
  permalink,
} from '../../fake-data/user';
import userProfileResponse from '../../fake-data/user-profile-response';
import { readUserProfilePage } from '../../util/file-reader';
import app from '../../../src/app';
import config from '../../../src/config';
import elasticsearchClient from '../../../src/clients/elasticsearch';

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
          expect(res.body.avatar_url).toEqual(userProfileResponse.avatar_url);
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
        .reply(200, userProfilePage);

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

    test('permalink must be valid', (done) => {
      expect.assertions(3);

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(404);

      request(app)
        .post('/api/users')
        .send({ permalink: invalidPermalink })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.status).toEqual(404);
          expect(res.body.message).toBe('Unable to find user profile page.');
          done();
        });
    });

    test('user id must be valid', async (done) => {
      expect.assertions(3);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage);

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: soundCloudClientId })
        .reply(404);

      request(app)
        .post('/api/users')
        .send({ permalink })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.status).toEqual(404);
          expect(res.body.message).toBe('Unable to find user profile page.');
          done();
        });
    });
  });
});
