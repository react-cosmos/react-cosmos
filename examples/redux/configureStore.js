import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { devToolsEnhancer } from 'redux-devtools-extension';

const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
});

export default function(initialState) {
  const store = createStore(reducer, initialState, devToolsEnhancer());

  return store;
}
