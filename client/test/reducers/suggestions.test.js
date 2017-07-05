import { suggestions as actions } from '../../src/actions';
import { suggestions as reducer } from '../../src/reducers';

describe('query reducer', () => {
  test('should return the initial state', () => {
    const stateBefore = undefined;
    const action = {};
    const stateAfter = {
      error: '',
      isFetching: false,
      list: [],
    };

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  test('should handle FETCH_SUGGESTIONS_REQUEST action', () => {
    const stateBefore = {
      error: 'Something went wrong...',
      isFetching: false,
      list: [],
    };
    const action = {
      type: actions.FETCH_SUGGESTIONS_REQUEST,
    };
    const stateAfter = {
      error: '',
      isFetching: true,
      list: [],
    };

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  test('should handle FETCH_SUGGESTIONS_SUCCESS action', () => {
    const stateBefore = {
      error: '',
      isFetching: true,
      list: [],
    };
    const action = {
      type: actions.FETCH_SUGGESTIONS_SUCCESS,
      suggestions: ['justinbieber', 'justintimberlake'],
    };
    const stateAfter = {
      error: '',
      isFetching: false,
      list: ['justinbieber', 'justintimberlake'],
    };

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  test('should handle FETCH_SUGGESTIONS_FAILURE action', () => {
    const stateBefore = {
      error: '',
      isFetching: true,
      list: [],
    };
    const action = {
      type: actions.FETCH_SUGGESTIONS_FAILURE,
      message: 'Something went wrong...',
    };
    const stateAfter = {
      error: 'Something went wrong...',
      isFetching: false,
      list: [],
    };

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
