import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRouterMethods,
  onRouter,
} from '../../../testHelpers/pluginMocks.js';
import { resetUrlParams } from '../../../testHelpers/urlParams.js';

beforeEach(register);

afterEach(() => {
  resetPlugins();
  resetUrlParams();
});

const fixtureId = { path: 'zwei.js' };

it('emits "fixtureReselect" event', async () => {
  const { fixtureReselect } = onRouter();

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);
  getRouterMethods().selectFixture(fixtureId);

  await waitFor(() =>
    expect(fixtureReselect).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
