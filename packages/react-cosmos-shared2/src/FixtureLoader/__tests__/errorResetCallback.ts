import retry from '@skidding/async-retry';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: 'First' };
const fixtureId = { path: 'first', name: null };

const onErrorReset = jest.fn();
beforeEach(() => {
  onErrorReset.mockReset();
});

testFixtureLoader(
  'fires error reset callback when selecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(onErrorReset).toBeCalledTimes(1));
  }
);

testFixtureLoader(
  'fires error reset callback when unselecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture, unselectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await unselectFixture({ rendererId });
    await retry(() => expect(onErrorReset).toBeCalledTimes(2));
  }
);
