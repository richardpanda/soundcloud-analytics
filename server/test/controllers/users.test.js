import { createRequest, createResponse } from 'node-mocks-http';
import nock from 'nock';

import { id, permalink } from '../fake-data/user';
import userProfileResponse from '../fake-data/user-profile-response';
import { readUserProfilePage } from '../utils/file-reader';

const {
  ELASTICSEARCH_ADDRESS,
  ELASTICSEARCH_INDEX,
  ELASTICSEARCH_PORT,
  ELASTICSEARCH_TYPE,
  SOUNDCLOUD_CLIENT_ID,
} = process.env;

describe('Users controller tests', () => {
  describe('createUser', () => {
    afterEach(() => {
      jest.resetModules();
      nock.cleanAll();
    });

    test('request body must contain permalink', async () => {
      expect.assertions(2);

      const { users } = require('../../src/controllers');

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

      jest.mock('../../src/models/user', () => {
        return {
          findOne: jest.fn((options) => ({ id: 69257219, permalink: 'nghtmre' })),
        };
      });
      const { users } = require('../../src/controllers');
      const { User } = require('../../src/models');

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

      jest.mock('../../src/models/user', () => {
        return {
          findOne: jest.fn((options) => null),
        };
      });

      const { users } = require('../../src/controllers');
      const { User } = require('../../src/models');

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
      expect.assertions(6);

      const userProfilePage = await readUserProfilePage();

      nock('https://soundcloud.com')
        .get(`/${permalink}`)
        .reply(200, userProfilePage)

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: process.env.SOUNDCLOUD_CLIENT_ID })
        .reply(200, userProfileResponse);

      jest.mock('../../src/models/user', () => {
        return {
          create: jest.fn(),
          findOne: jest.fn((options) => null),
        };
      });

      jest.mock('../../src/clients/elasticsearch', () => {
        return {
          create: jest.fn(),
        };
      });

      const { elasticsearchClient } = require('../../src/clients');
      const { users } = require('../../src/controllers');
      const { User } = require('../../src/models');

      const findOneSpy = jest.spyOn(User, 'findOne');
      const postgresCreateSpy = jest.spyOn(User, 'create');
      const elasticsearchCreateSpy = jest.spyOn(elasticsearchClient, 'create');

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

      expect(findOneSpy).toHaveBeenCalledWith({ where: { permalink } });
      expect(postgresCreateSpy).toHaveBeenCalledWith({ id, permalink });
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
      expect(response.statusCode).toBe(200);
      expect(responseBody.id).toBe(id);
      expect(responseBody.permalink).toBe(permalink);
    });
  });
});
