import { createPlugin } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { createArrayPlug } from '../../shared/slot';
import { StorageSpec } from '../Storage/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { ResponsivePreviewSpec, Viewport } from './public';
import {
  Context,
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT,
  STORAGE_KEY
} from './shared';
import { ResponsivePreview } from './ResponsivePreview';
import { Props as ToggleButtonProps, ToggleButton } from './ToggleButton';

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
    const { devices } = context.getConfig();
    const { enabled } = context.getState();
    const storage = context.getMethodsOf<StorageSpec>('storage');
    const router = context.getMethodsOf<RouterSpec>('router');
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    const fixtureState = rendererCore.getFixtureState();
    const viewport =
      fixtureState.viewport || getActiveViewport(context, enabled);

    return {
      devices,
      viewport,
      fullScreen: router.isFullScreen(),
      validFixtureSelected: rendererCore.isValidFixtureSelected(),
      setViewport(newViewport: Viewport) {
        storage.setItem(STORAGE_KEY, newViewport);
        setFixtureStateViewport(context, newViewport);
        context.setState({ enabled: true });
      }
    };
  }
});

plug({
  slotName: 'rendererActions',
  render: createArrayPlug<ToggleButtonProps>('rendererActions', ToggleButton),
  getProps: context => {
    const { enabled } = context.getState();
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    const fixtureState = rendererCore.getFixtureState();
    const responsiveModeOn = isResponsiveModeOn(enabled, fixtureState);

    return {
      validFixtureSelected: rendererCore.isValidFixtureSelected(),
      responsiveModeOn,
      toggleViewportState() {
        const nextEnabled = !responsiveModeOn;
        context.setState({ enabled: nextEnabled });
        setFixtureStateViewport(
          context,
          getActiveViewport(context, nextEnabled)
        );
      }
    };
  }
});

export { register };

function getActiveViewport(context: Context, responsiveModeEnabled: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  return responsiveModeEnabled
    ? storage.getItem(STORAGE_KEY) || DEFAULT_VIEWPORT
    : null;
}

function setFixtureStateViewport(context: Context, viewport: null | Viewport) {
  const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState(fixtureState => ({ ...fixtureState, viewport }));
}

function isResponsiveModeOn(
  responsiveModeEnabled: boolean,
  fixtureState: FixtureState
): boolean {
  return fixtureState.viewport ? true : responsiveModeEnabled;
}
