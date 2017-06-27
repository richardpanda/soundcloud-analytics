const elasticsearch = require('elasticsearch');

const config = require('../config');
const SoundCloudClient = require('../clients/soundcloud');

const elasticsearchClient = new elasticsearch.Client({
  host: config.elasticsearch.host,
});
const { index } = config.elasticsearch;
const soundCloudClient = new SoundCloudClient(config.soundcloud.clientId);

const createUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ message: 'Username is missing.' });
  }

  try {
    const userProfile = await soundCloudClient.fetchUserProfileByUsername(username);
    const isUserExists = await elasticsearchClient.exists({
      index,
      type: 'users',
      id: userProfile.data.id,
    });

    if (isUserExists) {
      res.status(400).send({ message: 'User already exists.' });
    } else {
      await elasticsearchClient.create({
        index,
        type: 'users',
        id: userProfile.data.id,
        body: {
          username: userProfile.username,
        },
      });
      res.status(200).send({ id: userProfile.data.id, username: userProfile.data.username });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  createUser,
};
