import { suggestions as actions } from '../actions';

const {
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  FETCH_SUGGESTIONS_FAILURE,
} = actions;
const initialState = {
  error: '',
  isFetching: false,
  list: [],
};

const query = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUGGESTIONS_REQUEST:
      return {
        ...state,
        error: '',
        isFetching: true,
      };
    case FETCH_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: action.suggestions,
      };
    case FETCH_SUGGESTIONS_FAILURE:
      return {
        ...state,
        error: action.message,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default query;
