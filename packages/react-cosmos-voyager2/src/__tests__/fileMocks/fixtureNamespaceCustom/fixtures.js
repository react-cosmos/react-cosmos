// @flow

import App from './App';

export default [
  {
    component: App,
    name: 'foo'
  },
  {
    component: App,
    name: 'bar',
    namespace: 'nested'
  },
  {
    component: App,
    name: 'baz',
    namespace: 'nested/again'
  }
];
