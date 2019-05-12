import { uuid } from 'react-cosmos-shared2/util';
import retry from '@skidding/async-retry';
import { runFixtureLoaderTests } from '../../testHelpers';

const rendererId = uuid();
const fixtures = { first: 'First' };
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureLoaderTests(mount => {
  it('fires change callback when selecting fixture', async () => {
    const onFixtureChange = jest.fn();
    await mount(
      { rendererId, fixtures, decorators, onFixtureChange },
      async ({ selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(onFixtureChange).toBeCalledTimes(1));
      }
    );
  });

  it('fires change callback when unselecting fixture', async () => {
    const onFixtureChange = jest.fn();
    await mount(
      { rendererId, fixtures, decorators, onFixtureChange },
      async ({ selectFixture, unselectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await unselectFixture({ rendererId });
        await retry(() => expect(onFixtureChange).toBeCalledTimes(2));
      }
    );
  });
});
