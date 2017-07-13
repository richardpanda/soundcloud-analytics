import { elasticsearchClient } from '../clients';

const { ELASTICSEARCH_INDEX, ELASTICSEARCH_TYPE } = process.env;
const index = ELASTICSEARCH_INDEX;
const type = ELASTICSEARCH_TYPE;

class Elasticsearch {
  static createSuggestion({ id, permalink }) {
    return elasticsearchClient.create({
      index,
      type,
      id,
      body: {
        suggest: {
          input: permalink.toLowerCase(),
        },
      },
      refresh: "true",
    });
  }

  static searchSuggestions(query) {
    return elasticsearchClient.search({
      index: ELASTICSEARCH_INDEX,
      body: {
        suggest: {
          suggestions: {
            prefix: query,
            completion: {
              field: 'suggest',
            },
          },
        },
      },
    });
  }

  static async setUpIndexAndMapping() {
    const body = {
      [type]: {
        properties: {
          suggest: {
            type: 'completion',
          },
          permalink: {
            type: 'keyword',
          },
        },
      },
    };

    const isIndexExists = await elasticsearchClient.indices.exists({
      index,
    });

    if (!isIndexExists) {
      await elasticsearchClient.indices.create({ index });
    }

    await elasticsearchClient.indices.putMapping({ index, type, body });
  }
}

export default Elasticsearch;
