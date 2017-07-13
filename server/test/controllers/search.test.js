jest.mock('../../src/utils/elasticsearch');

import { createRequest, createResponse } from 'node-mocks-http';

import { search } from '../../src/controllers';
import { Elasticsearch } from '../../src/utils';

import mockSearchResponse from '../data/search';

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

      const q = 'j';

      Elasticsearch.searchSuggestions = jest.fn(options => mockSearchResponse);

      const spy = jest.spyOn(Elasticsearch, 'searchSuggestions');

      const request = createRequest({ method, url, query: { q } });
      const response = createResponse();

      await search.searchPermalinkSuggestions(request, response);

      const responseBody = JSON.parse(response._getData());

      expect(spy).toHaveBeenCalledWith(q);
      expect(response.statusCode).toBe(200);
      expect(responseBody.suggestions).toEqual(['justinbieber', 'justintimberlake']);
    });
  });
});
