import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureLoaderTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: null, second: null };
const decorators = {};

runFixtureLoaderTests(mount => {
  it('renders blank state message', async () => {
    await mount({ rendererId, fixtures, decorators }, async ({ renderer }) => {
      expect(renderer.toJSON()).toEqual('No fixture loaded.');
    });
  });

  it('posts ready response on mount', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ rendererReady }) => {
        await rendererReady({
          rendererId,
          fixtures
        });
      }
    );
  });

  it('posts ready response again on ping request', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ rendererReady, pingRenderers }) => {
        await rendererReady({
          rendererId,
          fixtures
        });
        await pingRenderers();
        await rendererReady({
          rendererId,
          fixtures
        });
      }
    );
  });

  it('posts fixture list on "fixtures" prop change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ update, rendererReady, fixtureListUpdate }) => {
        await rendererReady({
          rendererId,
          fixtures
        });
        update({
          rendererId,
          fixtures: { ...fixtures, third: null },
          decorators
        });
        await fixtureListUpdate({
          rendererId,
          fixtures: { ...fixtures, third: null }
        });
      }
    );
  });
});
