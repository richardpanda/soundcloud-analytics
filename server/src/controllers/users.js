import elasticsearch from 'elasticsearch';

import { soundCloudClient } from '../clients';
import { Statistic, User } from '../models';
import { Elasticsearch } from '../utils';

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

    await Promise.all([
      Elasticsearch.createSuggestion({ id, permalink }),
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
    const user = await User.findOne({ where: { permalink: permalink.toLowerCase() } });

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
          date: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
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
