import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: { a: null, b: null, c: null }, second: null };

testFixtureLoader(
  'posts ready response on mount',
  { rendererId, fixtures },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: { first: ['a', 'b', 'c'], second: null }
    });
  }
);
