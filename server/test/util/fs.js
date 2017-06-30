import fs from 'fs';

export const readFile = (path, encoding) => (
  new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
);
