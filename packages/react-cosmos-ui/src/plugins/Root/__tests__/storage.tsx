import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  mockCore,
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks.js';

beforeEach(register);

afterEach(resetPlugins);

it('loads storage cache', () => {
  const mockLoadCache = jest.fn(() => Promise.resolve(null));
  mockStorage({ loadCache: mockLoadCache });
  mockCore({
    getProjectId: () => 'mockProjectId',
  });
  mockRendererCore({
    isValidFixtureSelected: () => false,
  });
  loadPlugins();
  expect(mockLoadCache).toBeCalledWith(expect.any(Object), 'mockProjectId');
});
