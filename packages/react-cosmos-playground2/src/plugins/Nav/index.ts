import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import {
  TreeExpansion,
  NAV_WIDTH_STORAGE_KEY,
  TREE_EXPANSION_STORAGE_KEY,
  NAV_WIDTH_DEFAULT
} from './shared';
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
      width:
        storage.getItem<number>(NAV_WIDTH_STORAGE_KEY) || NAV_WIDTH_DEFAULT,
      treeExpansion:
        storage.getItem<TreeExpansion>(TREE_EXPANSION_STORAGE_KEY) || {},
      selectFixture: router.selectFixture,
      setWidth: (newWidth: number) =>
        storage.setItem(NAV_WIDTH_STORAGE_KEY, newWidth),
      setTreeExpansion: (newTreeExpansion: TreeExpansion) =>
        storage.setItem(TREE_EXPANSION_STORAGE_KEY, newTreeExpansion)
    };
  }
});

export { register };
