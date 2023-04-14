import retry from '@skidding/async-retry';
import { uuid } from '../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/testFixtureLoader.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: { one: 'First' },
  second: 'Second',
});

testFixtureLoader(
  'renders selected fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testFixtureLoader(
  'renders selected named fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testFixtureLoader(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await fixtureStateChange({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {
        props: [],
      },
    });
  }
);

testFixtureLoader(
  'renders blank state after unselecting fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, unselectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await retry(() => expect(renderer.toJSON()).toBe('First'));
    unselectFixture({ rendererId });
    await retry(() => expect(renderer.toJSON()).toBe('No fixture selected.'));
  }
);

testFixtureLoader(
  'ignores "selectFixture" message for different renderer',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId: 'foobar',
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await retry(() => expect(renderer.toJSON()).toBe('No fixture selected.'));
  }
);

testFixtureLoader(
  'renders missing state on unknown fixture path',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'third' },
      fixtureState: {},
    });
    await retry(() =>
      expect(renderer.toJSON()).toBe('Fixture path not found: third')
    );
  }
);
