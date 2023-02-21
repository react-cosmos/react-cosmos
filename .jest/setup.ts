import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

jest.setTimeout(20000);

// This seems faster than transpiling node_modules/lodash-es
jest.mock('lodash-es', () => {
  return require('lodash');
});

// Jest with jsdom environment imports the "browser" ws export, which
// is a noop because wp isn't meant to be used in a browser environment.
// Issue introduced here https://github.com/websockets/ws/pull/2118
jest.mock('ws', () => {
  return jest.requireActual('../node_modules/ws/index.js');
});
