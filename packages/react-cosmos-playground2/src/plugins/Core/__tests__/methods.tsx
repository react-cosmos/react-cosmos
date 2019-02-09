import { loadPlugins } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
import { CoreSpec } from '../public';
import { register } from '..';

afterEach(cleanup);

const coreConfig: CoreSpec['config'] = {
  projectId: 'mockProjectId',
  fixturesDir: 'mockFixturesDir',
  fixtureFileSuffix: 'mockFixturesFileSuffix'
};

function loadTestPlugins() {
  loadPlugins({
    config: {
      core: coreConfig
    }
  });
}

function getCoreMethods() {
  return getMethodsOf<CoreSpec>('core');
}

it('returns project ID', async () => {
  register();
  loadTestPlugins();

  expect(getCoreMethods().getProjectId()).toBe('mockProjectId');
});

it('returns fixture file vars', async () => {
  register();
  loadTestPlugins();

  expect(getCoreMethods().getFixtureFileVars()).toEqual({
    fixturesDir: 'mockFixturesDir',
    fixtureFileSuffix: 'mockFixturesFileSuffix'
  });
});
