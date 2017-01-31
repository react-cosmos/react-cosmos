import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Replace with 'react-cosmos-redux-proxy' in real life
import createReduxProxy from '../../packages/react-cosmos-redux-proxy';
import flatrisReducer from './src/reducer';

export default function () {
  return createReduxProxy({
    createStore: initialState =>
      createStore(flatrisReducer, initialState, applyMiddleware(thunk)),
  });
}
