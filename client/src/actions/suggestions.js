import axios from 'axios';

export const FETCH_SUGGESTIONS_REQUEST = 'FETCH_SUGGESTIONS_REQUEST';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';

export const fetchSuggestionsRequest = () => ({
  type: FETCH_SUGGESTIONS_REQUEST,
});

export const fetchSuggestionsSuccess = suggestions => ({
  type: FETCH_SUGGESTIONS_SUCCESS,
  suggestions,
});

export const fetchSuggestionsFailure = message => ({
  type: FETCH_SUGGESTIONS_FAILURE,
  message,
});

export const fetchSuggestions = (query) => async (dispatch) => {
  dispatch(fetchSuggestionsRequest());
  try {
    const response = await axios.get(`http://localhost:4000/api/search?q=${query}`);
    return dispatch(fetchSuggestionsSuccess(response.data.suggestions));
  } catch ({ response }) {
    return dispatch(fetchSuggestionsFailure(response.data.message));
  }
};
