const { readUserProfilePage } = require('./util/file-reader');
const Parser = require('../src/util/parser');

describe('Parser tests', () => {
  test('extract user id from user profile html', async () => {
    expect.assertions(1);
    const userProfilePage = await readUserProfilePage();
    expect(Parser.extractUserIdFromUserProfilePage(userProfilePage)).toEqual('69257219');
  });
});
