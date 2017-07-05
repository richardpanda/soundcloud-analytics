import { query as actions } from '../../src/actions';
import { query as reducer } from '../../src/reducers';

describe('query reducer', () => {
  test('should return the initial state', () => {
    const stateBefore = undefined;
    const action = {};
    const stateAfter = '';

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  test('should handle CHANGE_QUERY action', () => {
    const stateBefore = '';
    const action = {
      type: actions.CHANGE_QUERY,
      query: 'j',
    };
    const stateAfter = 'j';

    expect(reducer(stateBefore, action)).toBe(stateAfter);
  });
});
