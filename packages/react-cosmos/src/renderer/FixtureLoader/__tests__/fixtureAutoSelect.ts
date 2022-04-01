import retry from '@skidding/async-retry';
import { uuid } from '../../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: { one: 'First' },
  second: 'Second',
});

testFixtureLoader(
  'renders auto selected named fixture',
  { rendererId, fixtures, selectedFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testFixtureLoader(
  'renders auto selected unnamed fixture',
  { rendererId, fixtures, selectedFixtureId: { path: 'second' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);
