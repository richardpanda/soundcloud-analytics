import { elasticsearchClient } from '../clients';

const { ELASTICSEARCH_INDEX, ELASTICSEARCH_TYPE } = process.env;
const index = ELASTICSEARCH_INDEX;
const type = ELASTICSEARCH_TYPE;

const setUpIndexAndMapping = async () => {
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
};

export default {
  setUpIndexAndMapping,
};
