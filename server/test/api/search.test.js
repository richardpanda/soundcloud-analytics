import request from 'supertest';

import app from '../../src/app';
import { elasticsearchClient } from '../../src/clients';
import { Elasticsearch } from '../../src/utils';

const { ELASTICSEARCH_INDEX, ELASTICSEARCH_TYPE } = process.env;
const index = ELASTICSEARCH_INDEX;
const type = ELASTICSEARCH_TYPE;

describe('Search API tests', () => {
  describe('GET /api/search?q=permalink', () => {
    const endpoint = '/api/search';

    beforeEach(async () => {
      const isIndexExists = await elasticsearchClient.indices.exists({ index });

      if (isIndexExists) {
        await elasticsearchClient.indices.delete({ index })
      }

      await Elasticsearch.setUpIndexAndMapping();
    });

    test('request must contain field q in query string', async () => {
      expect.assertions(2);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Field q is missing in query string.');
    });

    test('search when index is empty', async () => {
      expect.assertions(2);

      const response = await request(app).get(endpoint).query({ q: 'j' });

      expect(response.status).toBe(200);
      expect(response.body.suggestions).toEqual([]);
    });

    test('receive suggestions', async () => {
      expect.assertions(2);

      const justinBieber = {
        id: 1234,
        permalink: 'justinbieber',
      };
      const justinTimberlake = {
        id: 9876,
        permalink: 'justintimberlake',
      };
      await Promise.all([
        elasticsearchClient.create({
          index,
          type,
          id: justinBieber.id,
          body: {
            suggest: {
              input: justinBieber.permalink,
            },
          },
          refresh: "true",
        }),
        elasticsearchClient.create({
          index,
          type,
          id: justinTimberlake.id,
          body: {
            suggest: {
              input: justinTimberlake.permalink,
            },
          },
          refresh: "true",
        })
      ]);

      const response = await request(app).get(endpoint).query({ q: 'j' });

      expect(response.status).toBe(200);
      expect(response.body.suggestions).toEqual(['justinbieber', 'justintimberlake']);
    });
  });
});
