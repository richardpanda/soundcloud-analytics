const fs = require('fs');

const Parser = require('../src/util/parser');

describe('Parser tests', () => {
  test('extract user id from user profile html', (done) => {
    fs.readFile('./test/fake-data/user-profile.html', 'utf8', (err, userProfileHtml) => {
      expect(err).toBeNull();
      expect(Parser.extractUserIdFromUserProfileHtml(userProfileHtml)).toEqual('69257219');
      done();
    });
  });
});
