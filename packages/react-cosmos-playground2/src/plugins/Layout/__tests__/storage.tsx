import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockStorage, mockCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

it('loads storage cache', () => {
  const mockLoadCache = jest.fn(() => Promise.resolve(null));
  mockStorage({ loadCache: mockLoadCache });
  mockCore({
    getProjectId: () => 'mockProjectId'
  });
  register();
  loadPlugins();
  expect(mockLoadCache).toBeCalledWith(expect.any(Object), 'mockProjectId');
});
