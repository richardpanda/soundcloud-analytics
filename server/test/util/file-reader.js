const { USER_PROFILE_PAGE_PATH, ENCODING } = require('./constants');
const { readFile } = require('./fs');

const readUserProfilePage = () => readFile(USER_PROFILE_PAGE_PATH, ENCODING);

module.exports = {
  readUserProfilePage,
};
