import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { TreeExpansion, TREE_EXPANSION_STORAGE_KEY } from './shared';
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
      fixturesDir,
      fixtureFileSuffix,
      selectedFixtureId: router.getSelectedFixtureId(),
      fullScreen: router.isFullScreen(),
      rendererConnected: rendererCore.isRendererConnected(),
      fixtures: rendererCore.getFixtures(),
      treeExpansion:
        storage.getItem<TreeExpansion>(TREE_EXPANSION_STORAGE_KEY) || {},
      selectFixture: router.selectFixture,
      setTreeExpansion: (newTreeExpansion: TreeExpansion) =>
        storage.setItem(TREE_EXPANSION_STORAGE_KEY, newTreeExpansion)
    };
  }
});

export { register };
