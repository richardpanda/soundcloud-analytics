import nock from 'nock';

import mockUsers from '../data/users.json';
import justinBieberProfile from '../data/users/justinbieber/user.json';
import justinTimberlakeProfile from '../data/users/justintimberlake/user.json';
import nghtmreProfile from '../data/users/nghtmre/user.json';

const userProfileByPermalink = {
  justinbieber: justinBieberProfile,
  justintimberlake: justinTimberlakeProfile,
  nghtmre: nghtmreProfile,
};

describe('Statistics tests', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('add new statistics', async () => {
    expect.assertions(2);

    for (let user of mockUsers) {
      const { id, permalink } = user;

      nock('http://api.soundcloud.com')
        .get(`/users/${id}`)
        .query({ client_id: process.env.SOUNDCLOUD_CLIENT_ID })
        .reply(200, userProfileByPermalink[permalink]);
    }

    jest.mock('../../src/models/user', () => {
      return {
        findAll: jest.fn(() => mockUsers),
      };
    });

    jest.mock('../../src/models/statistic', () => {
      return {
        create: jest.fn(),
      };
    });

    const { User, Statistic } = require('../../src/models');
    const { Statistics } = require('../../src/utils');
    const spy = jest.spyOn(Statistic, 'create');

    const errors = await Statistics.addNewStatistics();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(errors).toEqual([]);
  });
});
