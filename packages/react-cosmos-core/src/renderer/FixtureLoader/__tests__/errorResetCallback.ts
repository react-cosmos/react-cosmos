import retry from '@skidding/async-retry';
import { uuid } from '../../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/testFixtureLoader.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({ first: 'First' });
const fixtureId = { path: 'first' };

const onErrorReset = jest.fn();
beforeEach(() => {
  onErrorReset.mockReset();
});

testFixtureLoader(
  'fires error reset callback when selecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(onErrorReset).toBeCalledTimes(1));
  }
);

testFixtureLoader(
  'fires error reset callback when unselecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture, unselectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    unselectFixture({ rendererId });
    await retry(() => expect(onErrorReset).toBeCalledTimes(2));
  }
);
