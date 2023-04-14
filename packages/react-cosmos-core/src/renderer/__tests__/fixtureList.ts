import { uuid } from '../../utils/uuid.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({ first: null, second: null });

testRenderer(
  'renders blank state message',
  { rendererId, fixtures },
  async ({ renderer }) => {
    expect(renderer.toJSON()).toEqual('No fixture selected.');
  }
);

testRenderer(
  'posts ready response on mount',
  { rendererId, fixtures },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testRenderer(
  'posts ready response again on ping request',
  { rendererId, fixtures },
  async ({ rendererReady, pingRenderers }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
    pingRenderers();
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testRenderer(
  'posts fixture list on "fixtures" prop change',
  { rendererId, fixtures },
  async ({ update, rendererReady, fixtureListUpdate }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
    update({
      rendererId,
      fixtures: { ...fixtures, ...wrapFixtures({ third: null }) },
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
        third: { type: 'single' },
      },
    });
  }
);
