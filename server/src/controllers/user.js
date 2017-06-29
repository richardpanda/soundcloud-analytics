const elasticsearch = require('elasticsearch');

const config = require('../config');
const elasticsearchClient = require('../clients/elasticsearch');
const SoundCloudClient = require('../clients/soundcloud');

const { index } = config.elasticsearch;
const soundCloudClient = new SoundCloudClient(config.soundcloud.clientId);
const type = 'user';

const createUser = async (req, res) => {
  const { permalink } = req.body;

  if (!permalink) {
    return res.status(400).send({ message: 'Permalink is missing.' });
  }

  try {
    const isUserExists = await elasticsearchClient.exists({
      index,
      type,
      id: permalink,
    });

    if (isUserExists) {
      return res.status(400).send({ message: 'User already exists.' });
    }

    const userProfile = await soundCloudClient.fetchUserProfileByUserPermalink(permalink);
    const documentData = {
      id: userProfile.id,
      permalink: userProfile.permalink,
      username: userProfile.username,
    };

    await elasticsearchClient.create({
      index,
      type,
      id: permalink,
      body: documentData,
    });

    res.status(200).send(documentData);
  } catch (err) {
    const { message, status } = err;
    res.status(status).send({ message });
  }
};

module.exports = {
  createUser,
};
