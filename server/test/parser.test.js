const fs = require('fs');

const Parser = require('../src/util/parser');

describe('Parser tests', () => {
  test('extract user id from user profile html', (done) => {
    fs.readFile('./test/fake-data/user-profile-page.html', 'utf8', (err, userProfilePage) => {
      expect(err).toBeNull();
      expect(Parser.extractUserIdFromUserProfilePage(userProfilePage)).toEqual('69257219');
      done();
    });
  });
});
