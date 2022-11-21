import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

jest.setTimeout(20000);

// This seems faster than transpiling node_modules/lodash-es
jest.mock('lodash-es', () => {
  return require('lodash');
});
