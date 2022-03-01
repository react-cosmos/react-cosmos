import { waitFor } from '@testing-library/dom';
import { FixtureList } from 'react-cosmos-shared2/renderer';
import { mockNotifications, mockRouter } from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { mockRendererReady } from '../../testHelpers';

beforeEach(() => jest.isolateModules(() => require('../..')));

afterEach(resetPlugins);

const fixtureId = { path: 'ein.js' };
const fixtures: FixtureList = { [fixtureId.path]: { type: 'single' } };

function registerTestPlugins() {
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
  return { selectFixture };
}

function loadTestPlugins() {
  loadPlugins();
}

it('selects initial fixture', async () => {
  const { selectFixture } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId', fixtures, { path: 'ein.js' });

  await waitFor(() =>
    expect(selectFixture).toBeCalledWith(expect.any(Object), { path: 'ein.js' })
  );
});
