import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { NavSpec } from './public';
import { Nav } from './Nav';

const { plug, register } = createPlugin<NavSpec>({ name: 'nav' });

plug({
  slotName: 'left',
  render: Nav,
  getProps: ({ getMethodsOf }) => {
    const storage = getMethodsOf<StorageSpec>('storage');
    const router = getMethodsOf<RouterSpec>('router');
    const core = getMethodsOf<CoreSpec>('core');
    const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
    const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

    return {
      projectId: core.getProjectId(),
      fixturesDir,
      fixtureFileSuffix,
      selectedFixtureId: router.getSelectedFixtureId(),
      fullScreen: router.isFullScreen(),
      rendererConnected: rendererCore.isRendererConnected(),
      fixtures: rendererCore.getFixtures(),
      selectFixture: router.selectFixture,
      storage
    };
  }
});

export { register };
