jest.mock('../../src/models/user');
jest.mock('../../src/models/statistic');

import nock from 'nock';

import { User, Statistic } from '../../src/models';
import { Statistics } from '../../src/utils';

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

    User.findAll = jest.fn(() => mockUsers);
    Statistic.create = jest.fn();

    const spy = jest.spyOn(Statistic, 'create');

    const errors = await Statistics.addNewStatistics();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(errors).toEqual([]);
  });
});
