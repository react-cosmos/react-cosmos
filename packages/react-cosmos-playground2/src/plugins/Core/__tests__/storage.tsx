import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockStorage } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

it('loads storage cache', () => {
  const mockLoadCache = jest.fn(() => Promise.resolve(null));
  mockStorage({ loadCache: mockLoadCache });
  register();
  loadPlugins({
    config: { core: { projectId: 'mockProjectId' } }
  });
  expect(mockLoadCache).toBeCalledWith(expect.any(Object), 'mockProjectId');
});
