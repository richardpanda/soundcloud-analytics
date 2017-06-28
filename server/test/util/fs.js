const fs = require('fs');

const readFile = (path, encoding) => (
  new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
);

module.exports = {
  readFile,
}
