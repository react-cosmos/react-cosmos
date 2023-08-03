import { loadPlugins, resetPlugins } from 'react-plugin';
import { mockCore, mockStorage } from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';

beforeEach(register);

afterEach(resetPlugins);

it('loads storage cache', () => {
  const mockLoadCache = jest.fn(() => Promise.resolve(null));
  mockStorage({ loadCache: mockLoadCache });
  mockCore({
    getProjectId: () => 'mockProjectId',
  });
  loadPlugins();
  expect(mockLoadCache).toBeCalledWith(expect.any(Object), 'mockProjectId');
});
