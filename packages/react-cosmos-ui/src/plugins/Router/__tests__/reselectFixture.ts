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

it('emits "fixtureChange" event without fixture state reset false', async () => {
  const { fixtureChange } = onRouter();

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);
  getRouterMethods().selectFixture(fixtureId);

  await waitFor(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId, false)
  );
});
