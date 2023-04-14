import retry from '@skidding/async-retry';
import { uuid } from '../../utils/uuid.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({ first: 'First' });
const fixtureId = { path: 'first' };

const onErrorReset = jest.fn();
beforeEach(() => {
  onErrorReset.mockReset();
});

testRenderer(
  'fires error reset callback when selecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await retry(() => expect(onErrorReset).toBeCalledTimes(1));
  }
);

testRenderer(
  'fires error reset callback when unselecting fixture',
  { rendererId, fixtures, onErrorReset },
  async ({ selectFixture, unselectFixture }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    unselectFixture({ rendererId });
    await retry(() => expect(onErrorReset).toBeCalledTimes(2));
  }
);
