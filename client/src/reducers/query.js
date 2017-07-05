import { query as actions } from '../actions';

const { CHANGE_QUERY } = actions;
const initialState = '';

const query = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_QUERY:
      return action.query;
    default:
      return state;
  }
};

export default query;
