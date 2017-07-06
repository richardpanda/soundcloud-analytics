import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';

import query from './query';
import suggestions from './suggestions';

export { query };
export { suggestions };

export default combineReducers({
  query,
  router,
  suggestions,
});
