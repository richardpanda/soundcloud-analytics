import nock from 'nock';
import request from 'supertest';

import { id, permalink } from '../data/user';
import userProfileResponse from '../data/user-profile-response';
import { readUserProfilePage } from '../utils/file-reader';
import app from '../../src';
import { elasticsearchClient } from '../../src/clients';
import { User } from '../../src/models';

const { ELASTICSEARCH_INDEX, SOUNDCLOUD_CLIENT_ID } = process.env;
const index = ELASTICSEARCH_INDEX;

describe('Users API tests', () => {
  describe('POST /api/users', () => {
    const endpoint = '/api/users';

    beforeEach(async () => {
      nock.cleanAll();

      const resetPostgresUsersTable = User.sync({ force: true });
      const isIndexExists = await elasticsearchClient.indices.exists({ index });

      if (isIndexExists) {
        await Promise.all([
          resetPostgresUsersTable,
          elasticsearchClient.indices.delete({ index })
        ]);
      } else {
        await resetPostgresUsersTable;
      }
    });

    test('request body must contain permalink', async () => {
      expect.assertions(2);

      const response = await request(app).post(endpoint);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Permalink is missing.');
    });

    test('prevent creating duplicate users', async () => {
      await User.create({ id, permalink });

      const response = await request(app).post(endpoint).send({ permalink });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists.');
    });

    test('permalink must be valid', async () => {
      expect.assertions(2);

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(404);

      const response = await request(app).post(endpoint).send({ permalink });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Unable to find user profile page.');
    });


    test('create SoundCloud user', async () => {
      expect.assertions(3);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage)

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: SOUNDCLOUD_CLIENT_ID })
        .reply(200, userProfileResponse);

      const response = await request(app).post(endpoint).send({ permalink });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.permalink).toBe(permalink);
    });
  });
});
