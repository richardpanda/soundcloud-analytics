class Parser {
  static extractUserIdFromUserProfileHtml(userProfileHtml) {
    const re = /soundcloud:\/\/users:(\d+)/;
    const match = re.exec(userProfileHtml);
    return match[1];
  }
}

module.exports = Parser;
