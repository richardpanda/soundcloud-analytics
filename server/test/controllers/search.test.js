jest.mock('../../src/clients/elasticsearch');

import { createRequest, createResponse } from 'node-mocks-http';

import { elasticsearchClient } from '../../src/clients';
import { search } from '../../src/controllers';

import mockSearchResponse from '../data/search';

const { ELASTICSEARCH_INDEX } = process.env;

describe('Search controller tests', () => {
  describe('searchPermalinkSuggestions', () => {
    const method = 'GET';
    const url = '/api/search';

    test('request must contain field q in query string', async () => {
      expect.assertions(2);

      const request = createRequest({ method, url });
      const response = createResponse();

      await search.searchPermalinkSuggestions(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(response.statusCode).toBe(400);
      expect(responseBody.message).toBe('Field q is missing in query string.');
    });

    test('receive suggestions', async () => {
      expect.assertions(3);

      elasticsearchClient.search = jest.fn(options => mockSearchResponse);

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
