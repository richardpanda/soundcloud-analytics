import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { suggestions as actions } from '../../src/actions';

const initialState = {};
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('suggestions actions', () => {
  describe('sync actions', () => {
    test('fetchSuggestionsRequest should create FETCH_SUGGESTIONS_REQUEST action', () => {
      expect(actions.fetchSuggestionsRequest()).toEqual({
        type: actions.FETCH_SUGGESTIONS_REQUEST,
      });
    });

    test('fetchSuggestionsSuccess should create FETCH_SUGGESTIONS_SUCCESS action', () => {
      const suggestions = ['justinbieber', 'justintimberlake'];
      expect(actions.fetchSuggestionsSuccess(suggestions)).toEqual({
        type: actions.FETCH_SUGGESTIONS_SUCCESS,
        suggestions,
      });
    });

    test('fetchSuggestionsFailure should create FETCH_SUGGESTIONS_FAILURE action', () => {
      const message = 'Something went wrong...';
      expect(actions.fetchSuggestionsFailure(message)).toEqual({
        type: actions.FETCH_SUGGESTIONS_FAILURE,
        message,
      });
    });
  });

  describe('async actions', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test('creates FETCH_SUGGESTIONS_SUCCESS', async () => {
      const query = 'j';
      const suggestions = ['justinbieber', 'justintimberlake'];
      const expectedActions = [
        { type: actions.FETCH_SUGGESTIONS_REQUEST },
        { type: actions.FETCH_SUGGESTIONS_SUCCESS, suggestions }
      ];
      const store = mockStore(initialState);

      nock('http://localhost:4000')
        .get('/api/search')
        .query({ q: query })
        .reply(200, { suggestions });

      await store.dispatch(actions.fetchSuggestions(query));

      expect(store.getActions()).toEqual(expectedActions);
    });

    test('creates FETCH_SUGGESTIONS_FAILURE', async () => {
      const query = 'j';
      const message = 'Something went wrong...';
      const expectedActions = [
        { type: actions.FETCH_SUGGESTIONS_REQUEST },
        { type: actions.FETCH_SUGGESTIONS_FAILURE, message }
      ];
      const store = mockStore(initialState);

      nock('http://localhost:4000')
        .get('/api/search')
        .query({ q: query })
        .reply(400, { message });

      await store.dispatch(actions.fetchSuggestions(query));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
