import elasticsearch from 'elasticsearch';

import { elasticsearchClient, soundCloudClient } from '../clients';
import { User } from '../models';

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

    await Promise.all([
      User.create({ id, permalink }),
      elasticsearchClient.create({
        index,
        type,
        id,
        body: {
          suggest: {
            input: permalink,
          },
        },
        refresh: "true",
      })
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

export default {
  createUser,
};
