import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockStorage,
  mockCore,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks';

beforeEach(() => jest.isolateModules(() => require('..')));

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
