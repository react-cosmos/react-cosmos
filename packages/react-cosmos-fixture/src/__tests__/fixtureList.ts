import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: null, second: null };

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
    await rendererReady({ rendererId, fixtures });
  }
);

testFixtureLoader(
  'posts ready response again on ping request',
  { rendererId, fixtures },
  async ({ rendererReady, pingRenderers }) => {
    await rendererReady({ rendererId, fixtures });
    await pingRenderers();
    await rendererReady({ rendererId, fixtures });
  }
);

testFixtureLoader(
  'posts fixture list on "fixtures" prop change',
  { rendererId, fixtures },
  async ({ update, rendererReady, fixtureListUpdate }) => {
    await rendererReady({ rendererId, fixtures });
    update({
      rendererId,
      fixtures: { ...fixtures, third: null }
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: { ...fixtures, third: null }
    });
  }
);
