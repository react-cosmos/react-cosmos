import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: { one: 'First' },
  second: 'Second'
};

testFixtureLoader(
  'renders initially selected named fixture',
  { rendererId, fixtures, selectedFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testFixtureLoader(
  'renders initially selected unnamed fixture',
  { rendererId, fixtures, selectedFixtureId: { path: 'second', name: null } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);
