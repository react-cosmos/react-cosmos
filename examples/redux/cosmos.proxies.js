import createReduxProxy from 'react-cosmos-redux-proxy';

import { createStore, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';

import { devToolsEnhancer } from 'redux-devtools-extension';

const formReducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
});

const ReduxProxy = createReduxProxy({
  createStore: initialState => {
    const store = createStore(formReducer, initialState, devToolsEnhancer());

    return store;
  }
});

export default [ReduxProxy];
