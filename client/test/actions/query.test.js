import { query as actions } from '../../src/actions';

describe('query actions', () => {
  test('changeQuery should create CHANGE_QUERY action', () => {
    const query = 'j';
    expect(actions.changeQuery(query)).toEqual({
      type: actions.CHANGE_QUERY,
      query,
    });
  });
});
