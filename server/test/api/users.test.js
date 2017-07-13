import nock from 'nock';
import request from 'supertest';

import mockUserProfileResponse from '../data/users/justintimberlake/user';
import { readUserProfilePage } from '../utils/file-reader';
import app from '../../src/app';
import { elasticsearchClient, postgresClient } from '../../src/clients';
import { User, Statistic } from '../../src/models';
import { Elasticsearch } from '../../src/utils';

const { id, permalink } = mockUserProfileResponse;
const { ELASTICSEARCH_INDEX, SOUNDCLOUD_CLIENT_ID } = process.env;
const index = ELASTICSEARCH_INDEX;

describe('Users API tests', () => {
  describe('POST /api/users', () => {
    const endpoint = '/api/users';

    beforeEach(async () => {
      nock.cleanAll();

      const resetPostgresTables = postgresClient.sync({ force: true });
      const isIndexExists = await elasticsearchClient.indices.exists({ index });

      if (isIndexExists) {
        await Promise.all([
          resetPostgresTables,
          elasticsearchClient.indices.delete({ index })
        ]);
      } else {
        await resetPostgresTables;
      }

      await Elasticsearch.setUpIndexAndMapping();
    });

    test('request body must contain permalink', async () => {
      expect.assertions(2);

      const response = await request(app).post(endpoint);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Permalink is missing.');
    });

    test('prevent creating duplicate users', async () => {
      expect.assertions(2);

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
        .reply(200, mockUserProfileResponse);

      const response = await request(app).post(endpoint).send({ permalink });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.permalink).toBe(permalink);
    });
  });

  describe('GET /api/users/:permalink/statistics', () => {
    const endpoint = `/api/users/${permalink}/statistics`;

    beforeEach(async () => {
      nock.cleanAll();
      await postgresClient.sync({ force: true });
    });

    test('user does not exist', async () => {
      expect.assertions(2);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User does not exist.');
    });

    test('retrieve user statistics', async () => {
      expect.assertions(2);

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: SOUNDCLOUD_CLIENT_ID })
        .reply(200, mockUserProfileResponse);

      const user = await User.create({ id, permalink });
      const statistics = await Promise.all([
        Statistic.create({ userId: user.id, date: '2017-07-01', followers: 1 }),
        Statistic.create({ userId: user.id, date: '2017-07-02', followers: 2 }),
        Statistic.create({ userId: user.id, date: '2017-07-03', followers: 3 }),
        Statistic.create({ userId: user.id, date: '2017-07-04', followers: 4 }),
      ]);
      const expectedStatistics = [
        ...statistics.map(({ date, followers}) => ({
          date,
          followers,
        })),
        {
          date: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
          followers: mockUserProfileResponse.followers_count,
        }
      ];

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.statistics).toEqual(expectedStatistics);
    });
  });
});
