import retry from '@skidding/async-retry';
import { uuid } from '../../../utils/uuid';
import { testFixtureLoader } from '../testHelpers';
import { wrapFixtures } from '../testHelpers/wrapFixture';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: { one: 'First' },
  second: 'Second',
});

testFixtureLoader(
  'renders initially selected named fixture',
  { rendererId, fixtures, initialFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testFixtureLoader(
  'renders initially selected unnamed fixture',
  { rendererId, fixtures, initialFixtureId: { path: 'second' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testFixtureLoader(
  'posts ready response on mount with initialFixtureId',
  { rendererId, fixtures, initialFixtureId: { path: 'second' } },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['one'] },
        second: { type: 'single' },
      },
      initialFixtureId: { path: 'second' },
    });
  }
);
