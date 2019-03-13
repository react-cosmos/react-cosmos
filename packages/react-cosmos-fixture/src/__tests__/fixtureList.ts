import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: null, second: null };
const decorators = {};

runFixtureConnectTests(mount => {
  it('renders blank state message', async () => {
    await mount({ rendererId, fixtures, decorators }, async ({ renderer }) => {
      expect(renderer.toJSON()).toEqual('No fixture loaded.');
    });
  });

  it('posts ready response on mount', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ untilMessage }) => {
        await untilMessage({
          type: 'rendererReady',
          payload: {
            rendererId,
            fixtures: { first: null, second: null }
          }
        });
      }
    );
  });

  it('posts ready response again on ping request', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ untilMessage, postMessage }) => {
        await untilMessage({
          type: 'rendererReady',
          payload: {
            rendererId,
            fixtures: { first: null, second: null }
          }
        });
        await postMessage({
          type: 'pingRenderers'
        });
        await untilMessage({
          type: 'rendererReady',
          payload: {
            rendererId,
            fixtures: { first: null, second: null }
          }
        });
      }
    );
  });

  it('posts fixture list on "fixtures" prop change', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ update, untilMessage }) => {
        await untilMessage({
          type: 'rendererReady',
          payload: {
            rendererId,
            fixtures: { first: null, second: null }
          }
        });
        update({
          rendererId,
          fixtures: {
            ...fixtures,
            third: null
          },
          decorators
        });
        await untilMessage({
          type: 'fixtureListUpdate',
          payload: {
            rendererId,
            fixtures: { first: null, second: null, third: null }
          }
        });
      }
    );
  });
});
