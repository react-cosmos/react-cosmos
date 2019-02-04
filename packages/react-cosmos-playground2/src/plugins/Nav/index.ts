import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { UrlParams, RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
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
    const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
      'rendererCoordinator'
    );

    const projectId = core.getProjectId();
    const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
    const urlParams = router.getUrlParams();
    const fixtures = rendererCoordinator.getFixtures();

    return {
      projectId,
      fixturesDir,
      fixtureFileSuffix,
      urlParams,
      rendererConnected: rendererCoordinator.isRendererConnected(),
      fixtures,
      setUrlParams: (newUrlParams: UrlParams) => {
        router.setUrlParams(newUrlParams);
      },
      storage
    };
  }
});

export { register };
