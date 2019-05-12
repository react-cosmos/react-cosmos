import { uuid } from 'react-cosmos-shared2/util';
import retry from '@skidding/async-retry';
import { runFixtureLoaderTests } from '../../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: { one: 'First' },
  second: 'Second'
};
const decorators = {};

runFixtureLoaderTests(mount => {
  it('renders selected fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId: { path: 'second', name: null },
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('Second'));
      }
    );
  });

  it('renders selected named fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId: { path: 'first', name: 'one' },
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('First'));
      }
    );
  });

  it('creates fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
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
  });

  it('renders blank state after unselecting fixture', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture, unselectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId: { path: 'second', name: null },
          fixtureState: {}
        });
        await unselectFixture({
          rendererId
        });
        expect(renderer.toJSON()).toBe('No fixture loaded.');
      }
    );
  });

  it('ignores "selectFixture" message for different renderer', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId: 'foobar',
          fixtureId: { path: 'second', name: null },
          fixtureState: {}
        });
        expect(renderer.toJSON()).toBe('No fixture loaded.');
      }
    );
  });

  it('renders missing state on unknown fixture path', async () => {
    await mount(
      { rendererId, fixtures, decorators },
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
  });
});
