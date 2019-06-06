import { uuid } from 'react-cosmos-shared2/util';
import retry from '@skidding/async-retry';
import { runFixtureLoaderTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: 'First' };
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureLoaderTests(mount => {
  it('fires error reset callback when selecting fixture', async () => {
    const onErrorReset = jest.fn();
    await mount(
      { rendererId, fixtures, decorators, onErrorReset },
      async ({ selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(onErrorReset).toBeCalledTimes(1));
      }
    );
  });

  it('fires error reset callback when unselecting fixture', async () => {
    const onErrorReset = jest.fn();
    await mount(
      { rendererId, fixtures, decorators, onErrorReset },
      async ({ selectFixture, unselectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await unselectFixture({ rendererId });
        await retry(() => expect(onErrorReset).toBeCalledTimes(2));
      }
    );
  });
});
