import elasticsearch from 'elasticsearch';

import elasticsearchClient from '../clients/elasticsearch';
import SoundCloudClient from '../clients/soundcloud';

const { ELASTICSEARCH_INDEX, SOUNDCLOUD_CLIENT_ID } = process.env;
const soundCloudClient = new SoundCloudClient(process.env.SOUNDCLOUD_CLIENT_ID);
const index = ELASTICSEARCH_INDEX;
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
      avatar_url: userProfile.avatar_url,
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

export default {
  createUser,
};
