class Parser {
  static extractUserIdFromUserProfilePage(userProfilePage) {
    const re = /soundcloud:\/\/users:(\d+)/;
    const match = re.exec(userProfilePage);
    return match[1];
  }
}

module.exports = Parser;
