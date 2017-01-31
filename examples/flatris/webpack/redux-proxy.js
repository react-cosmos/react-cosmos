import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import createReduxProxy from '../../../packages/react-cosmos-redux-proxy';
import flatrisReducer from '../src/reducer';

export default function () {
  return createReduxProxy({
    createStore: initialState =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  });
}
