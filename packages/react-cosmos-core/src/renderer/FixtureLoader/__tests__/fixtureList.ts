import { uuid } from '../../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({ first: null, second: null });

testFixtureLoader(
  'renders blank state message',
  { rendererId, fixtures },
  async ({ renderer }) => {
    expect(renderer.toJSON()).toEqual('No fixture selected.');
  }
);

testFixtureLoader(
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

testFixtureLoader(
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
    await pingRenderers();
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testFixtureLoader(
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
