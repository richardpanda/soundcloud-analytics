jest.mock('../../src/models/user');
jest.mock('../../src/models/statistic');
jest.mock('../../src/clients/elasticsearch');

import { createRequest, createResponse } from 'node-mocks-http';
import nock from 'nock';

import { elasticsearchClient } from '../../src/clients';
import { users } from '../../src/controllers';
import { User, Statistic } from '../../src/models';

import userProfileResponse from '../data/users/justintimberlake/user.json';
import mockStatistics from '../data/users/justintimberlake/statistics.json';
import { readUserProfilePage } from '../utils/file-reader';

const {
  ELASTICSEARCH_ADDRESS,
  ELASTICSEARCH_INDEX,
  ELASTICSEARCH_PORT,
  ELASTICSEARCH_TYPE,
  SOUNDCLOUD_CLIENT_ID,
} = process.env;
const { followers_count, id, permalink } = userProfileResponse;

describe('Users controller tests', () => {
  describe('createUser', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test('request body must contain permalink', async () => {
      expect.assertions(2);

      const request = createRequest({
        method: 'POST',
        url: '/api/users',
      });
      const response = createResponse();
      await users.createUser(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(response.statusCode).toBe(400);
      expect(responseBody.message).toBe('Permalink is missing.');
    });

    test('prevent creating duplicate users', async () => {
      expect.assertions(3);

      User.findOne = jest.fn((options) => ({ id: 69257219, permalink: 'nghtmre' }))

      const spy = jest.spyOn(User, 'findOne');

      const request = createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          permalink,
        },
      });
      const response = createResponse();
      await users.createUser(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(spy).toHaveBeenCalledWith({ where: { permalink } });
      expect(response.statusCode).toBe(400);
      expect(responseBody.message).toBe('User already exists.');
    });

    test('permalink must be valid', async () => {
      expect.assertions(3);

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(404);

      User.findOne = jest.fn((options) => null);

      const spy = jest.spyOn(User, 'findOne');

      const request = createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          permalink,
        },
      });
      const response = createResponse();
      await users.createUser(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(spy).toHaveBeenCalledWith({ where: { permalink } });
      expect(response.statusCode).toBe(404);
      expect(responseBody.message).toBe('Unable to find user profile page.');
    });

    test('create user', async () => {
      expect.assertions(7);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage)

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: process.env.SOUNDCLOUD_CLIENT_ID })
        .reply(200, userProfileResponse);

      User.create = jest.fn();
      User.findOne = jest.fn((options) => null);
      Statistic.create = jest.fn();
      elasticsearchClient.create = jest.fn();

      const elasticsearchCreateSpy = jest.spyOn(elasticsearchClient, 'create');
      const statisticCreateSpy = jest.spyOn(Statistic, 'create');
      const userCreateSpy = jest.spyOn(User, 'create');
      const userFindOneSpy = jest.spyOn(User, 'findOne');

      const request = createRequest({
        method: 'POST',
        url: '/api/users',
        body: {
          permalink,
        },
      });
      const response = createResponse();
      await users.createUser(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(elasticsearchCreateSpy).toHaveBeenCalledWith({
        index: ELASTICSEARCH_INDEX,
        type: ELASTICSEARCH_TYPE,
        id,
        body: {
          suggest: {
            input: permalink,
          },
        },
        refresh: "true",
      });
      expect(statisticCreateSpy).toHaveBeenCalledWith({ userId: id, followers: followers_count });
      expect(userFindOneSpy).toHaveBeenCalledWith({ where: { permalink } });
      expect(userCreateSpy).toHaveBeenCalledWith({ id, permalink });
      expect(response.statusCode).toBe(200);
      expect(responseBody.id).toBe(id);
      expect(responseBody.permalink).toBe(permalink);
    });
  });

  describe('readUserStatistics', () => {
    test('request params must contain permalink', async () => {
      expect.assertions(2);

      const request = createRequest({
        method: 'GET',
        url: `/api/users/${permalink}`,
      });
      const response = createResponse();
      await users.readUserStatistics(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(response.statusCode).toBe(400);
      expect(responseBody.message).toBe('Permalink is missing.');
    });

    test('user does not exist', async () => {
      expect.assertions(3);

      User.findOne((options) => null);

      const spy = jest.spyOn(User, 'findOne');

      const request = createRequest({
        method: 'GET',
        url: `/api/users/${permalink}`,
        params: {
          permalink,
        },
      });
      const response = createResponse();
      await users.readUserStatistics(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(spy).toHaveBeenCalledWith({ where: { permalink } });
      expect(response.statusCode).toBe(404);
      expect(responseBody.message).toBe('User does not exist.');
    });

    test('send user statistics', async () => {
      expect.assertions(4);

      const mockId = id;
      const mockPermalink = permalink;

      User.findOne = jest.fn((options) => ({ id: mockId, permalink: mockPermalink }));
      Statistic.findAll = jest.fn((options) => mockStatistics);

      const userFindOneSpy = jest.spyOn(User, 'findOne');
      const statisticFindAllSpy = jest.spyOn(Statistic, 'findAll');

      const request = createRequest({
        method: 'GET',
        url: `/api/users/${permalink}`,
        params: {
          permalink,
        },
      });
      const response = createResponse();
      await users.readUserStatistics(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(userFindOneSpy).toHaveBeenCalledWith({ where: { permalink } });
      expect(statisticFindAllSpy).toHaveBeenCalledWith({ where: { userId: id } });
      expect(response.statusCode).toBe(200);
      expect(responseBody.statistics).toEqual(mockStatistics);
    });
  });
});
