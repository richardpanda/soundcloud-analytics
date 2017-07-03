import { createRequest, createResponse } from 'node-mocks-http';

import mockSearchResponse from '../data/search-response';

const { ELASTICSEARCH_INDEX } = process.env;

describe('Search controller tests', () => {
  describe('searchPermalinkSuggestions', () => {
    const method = 'GET';
    const url = '/api/search';

    afterEach(() => {
      jest.resetModules();
    });

    test('request must contain field q in query string', async () => {
      expect.assertions(2);

      const { search } = require('../../src/controllers');

      const request = createRequest({ method, url });
      const response = createResponse();

      await search.searchPermalinkSuggestions(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(response.statusCode).toBe(400);
      expect(responseBody.message).toBe('Field q is missing in query string.');
    });

    test('receive suggestions', async () => {
      expect.assertions(3);

      jest.mock('../../src/clients/elasticsearch', () => {
        return {
          search: jest.fn(options => mockSearchResponse),
        };
      });

      const { elasticsearchClient } = require('../../src/clients');
      const { search } = require('../../src/controllers');

      const spy = jest.spyOn(elasticsearchClient, 'search');

      const request = createRequest({ method, url, query: { q: 'j' } });
      const response = createResponse();

      await search.searchPermalinkSuggestions(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(spy).toHaveBeenCalledWith({
        index: ELASTICSEARCH_INDEX,
        body: {
          suggest: {
            suggestions: {
              prefix: 'j',
              completion: {
                field: 'suggest',
              },
            },
          },
        },
      });
      expect(response.statusCode).toBe(200);
      expect(responseBody.suggestions).toEqual(['justinbieber', 'justintimberlake']);
    });
  });
});
