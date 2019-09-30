import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: { one: 'First' },
  second: 'Second'
};

testFixtureLoader(
  'renders selected fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({
      rendererId,
      fixtureId: { path: 'second', name: null },
      fixtureState: {}
    });
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testFixtureLoader(
  'renders selected named fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {}
    });
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testFixtureLoader(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({
      rendererId,
      fixtureId: { path: 'second', name: null },
      fixtureState: {}
    });
    await fixtureStateChange({
      rendererId,
      fixtureId: { path: 'second', name: null },
      fixtureState: {
        props: []
      }
    });
  }
);

testFixtureLoader(
  'renders blank state after unselecting fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture, unselectFixture }) => {
    await selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {}
    });
    await retry(() => expect(renderer.toJSON()).toBe('First'));
    await unselectFixture({ rendererId });
    await retry(() => expect(renderer.toJSON()).toBe('No fixture selected.'));
  }
);

testFixtureLoader(
  'ignores "selectFixture" message for different renderer',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({
      rendererId: 'foobar',
      fixtureId: { path: 'second', name: null },
      fixtureState: {}
    });
    await retry(() => expect(renderer.toJSON()).toBe('No fixture selected.'));
  }
);

testFixtureLoader(
  'renders missing state on unknown fixture path',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({
      rendererId,
      fixtureId: { path: 'third', name: null },
      fixtureState: {}
    });
    await retry(() =>
      expect(renderer.toJSON()).toBe('Fixture path not found: third')
    );
  }
);
