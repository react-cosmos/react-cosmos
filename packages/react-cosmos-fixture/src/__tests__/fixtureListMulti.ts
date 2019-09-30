import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureLoaderTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: { a: null, b: null, c: null }, second: null };

runFixtureLoaderTests(mount => {
  it('posts ready response on mount', async () => {
    await mount({ rendererId, fixtures }, async ({ rendererReady }) => {
      await rendererReady({
        rendererId,
        fixtures: { first: ['a', 'b', 'c'], second: null }
      });
    });
  });
});
