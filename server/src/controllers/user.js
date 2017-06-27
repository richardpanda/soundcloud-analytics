const elasticsearch = require('elasticsearch');

const config = require('../config');
const elasticsearchClient = require('../clients/elasticsearch');
const SoundCloudClient = require('../clients/soundcloud');

const { index } = config.elasticsearch;
const soundCloudClient = new SoundCloudClient(config.soundcloud.clientId);

const createUser = async (req, res) => {
  const { permalink } = req.body;

  if (!permalink) {
    return res.status(400).send({ message: 'Permalink is missing.' });
  }

  try {
    const userProfile = await soundCloudClient.fetchUserProfileByUserPermalink(permalink);
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
          permalink: userProfile.data.permalink,
          username: userProfile.data.username,
        },
      });
      res.status(200).send({
        id: userProfile.data.id,
        permalink: userProfile.data.permalink,
        username: userProfile.data.username,
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  createUser,
};
