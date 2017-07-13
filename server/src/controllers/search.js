import { Elasticsearch } from '../utils';

const searchPermalinkSuggestions = async (req, res) => {
  const { q } = req.query;

  if (q === undefined) {
    return res.status(400).json({ message: 'Field q is missing in query string.' });
  }

  try {
    const response = await Elasticsearch.searchSuggestions(q);

    if (!response.suggest) {
      return res.status(200).json({ suggestions: [] });
    }

    const suggestions = response.suggest.suggestions[0].options.map(option => option.text);
    res.status(200).json({ suggestions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  searchPermalinkSuggestions,
};
