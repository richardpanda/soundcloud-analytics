import { elasticsearchClient } from '../clients';

const { ELASTICSEARCH_INDEX } = process.env;

const searchPermalinkSuggestions = async (req, res) => {
  const { q } = req.query;

  if (q === undefined) {
    return res.status(400).json({ message: 'Field q is missing in query string.' });
  }

  try {
    const response = await elasticsearchClient.search({
      index: ELASTICSEARCH_INDEX,
      body: {
        suggest: {
          suggestions: {
            prefix: q,
            completion: {
              field: 'suggest',
            },
          },
        },
      },
    });
    const suggestions = response.suggest.suggestions[0].options.map(option => option.text);
    res.status(200).json({ suggestions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  searchPermalinkSuggestions,
};
