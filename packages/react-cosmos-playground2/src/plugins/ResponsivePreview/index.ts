import { createPlugin } from 'react-plugin';
import { createFixtureAction } from '../RendererHeader/createFixtureAction';
import { ResponsivePreview } from './ResponsivePreview';
import { Props as ToggleButtonProps, ToggleButton } from './ToggleButton';
import { CoreSpec } from '../Core/public';
import { RouterSpec } from '../Router/public';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { DEFAULT_DEVICES, Context } from './shared';
import { ResponsivePreviewSpec } from './public';
import { StorageSpec } from '../Storage/public';

const { plug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES
  },
  initialState: {
    enabled: false,
    viewport: null
  }
});

plug({
  slotName: 'rendererPreviewOuter',
  render: ResponsivePreview,
  getProps: context => {
    const { fullScreen } = context
      .getMethodsOf<RouterSpec>('router')
      .getUrlParams();

    return {
      ...getCommonProps(context),
      config: context.getConfig(),
      fullScreen: fullScreen !== undefined
    };
  }
});

plug({
  slotName: 'fixtureActions',
  render: createFixtureAction<ToggleButtonProps>(ToggleButton),
  getProps: context => getCommonProps(context)
});

export { register };

function getCommonProps(context: Context) {
  const { getState, setState, getMethodsOf } = context;

  const core = getMethodsOf<CoreSpec>('core');
  const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
    'rendererCoordinator'
  );

  return {
    state: getState(),
    projectId: core.getProjectId(),
    fixtureState: rendererCoordinator.getFixtureState(),
    validFixtureSelected: rendererCoordinator.isValidFixtureSelected(),
    setState,
    setFixtureStateViewport: () => setFixtureStateViewport(context),
    storage: getStorageApi(context)
  };
}

function getStorageApi({ getMethodsOf }: Context) {
  return getMethodsOf<StorageSpec>('storage');
}

function setFixtureStateViewport({ getState, getMethodsOf }: Context) {
  const { enabled, viewport } = getState();
  const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
    'rendererCoordinator'
  );

  rendererCoordinator.setFixtureState(fixtureState => ({
    ...fixtureState,
    // TODO: Make fixtureState.components optional and remove this
    components: fixtureState ? fixtureState.components : [],
    viewport: enabled ? viewport : null
  }));
}
