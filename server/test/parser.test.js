const { readFile } = require('./util/fs');
const Parser = require('../src/util/parser');

describe('Parser tests', () => {
  test('extract user id from user profile html', async () => {
    expect.assertions(1);

    const path = './test/fake-data/user-profile-page.html';
    const encoding = 'utf8';
    const userProfilePage = await readFile(path, encoding);

    expect(Parser.extractUserIdFromUserProfilePage(userProfilePage)).toEqual('69257219');
  });
});
