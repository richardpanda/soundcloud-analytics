import elasticsearch from 'elasticsearch';

import { elasticsearchClient, soundCloudClient } from '../clients';
import { Statistic, User } from '../models';

const { ELASTICSEARCH_INDEX, ELASTICSEARCH_TYPE } = process.env;
const index = ELASTICSEARCH_INDEX;
const type = ELASTICSEARCH_TYPE;

const createUser = async (req, res) => {
  const { permalink } = req.body;

  if (!permalink) {
    return res.status(400).json({ message: 'Permalink is missing.' });
  }

  try {
    const user = await User.findOne({ where: { permalink }});

    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const userProfile = await soundCloudClient.fetchUserProfileByUserPermalink(permalink);
    const id = userProfile.id;

    const elasticsearchCreatePromise = elasticsearchClient.create({
      index,
      type,
      id,
      body: {
        suggest: {
          input: permalink,
        },
      },
      refresh: "true",
    });

    await Promise.all([
      elasticsearchCreatePromise,
      User.create({ id, permalink })
    ]);

    res.status(200).json({ id, permalink });
  } catch (err) {
    const { message, status } = err;

    if (message && status) {
      return res.status(status).json({ message });
    }

    res.status(400).json({ message });
  }
};

const readUserStatistics = async (req, res) => {
  const { permalink } = req.params;

  if (!permalink) {
    return res.status(400).json({ message: 'Permalink is missing.' });
  }

  try {
    const user = await User.findOne({ where: { permalink } });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const [statistics, userProfile] = await Promise.all([
      Statistic.findAll({
        attributes: ['date', 'followers'],
        where: { userId: user.id },
      }),
      soundCloudClient.fetchUserProfileByUserId(user.id)
    ]);

    res.status(200).json({
      statistics: [
        ...statistics,
        {
          date: new Date().toISOString().split('T')[0],
          followers: userProfile.followers_count,
        }
      ],
    });
  } catch (err) {
    res.status(400).send({ message });
  }
};

export default {
  createUser,
  readUserStatistics,
};
