// @flow

import { registerPlugin } from 'react-plugin';
import { createFixtureAction } from '../RendererHeader/createFixtureAction';
import { ResponsivePreview } from './ResponsivePreview';
import { ToggleButton } from './ToggleButton';
import { DEFAULT_DEVICES } from './shared';

import type { CoreConfig } from '../Core';
import type { RouterState } from '../Router';
import type { ResponsivePreviewConfig, ResponsivePreviewState } from './shared';

export function register() {
  const { plug } = registerPlugin<
    ResponsivePreviewConfig,
    ResponsivePreviewState
  >({
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
      const {
        urlParams: { fullScreen }
      }: RouterState = context.getStateOf('router');

      return {
        ...getCommonProps(context),
        config: context.getConfig(),
        fullScreen: fullScreen !== undefined
      };
    }
  });

  plug({
    slotName: 'fixtureActions',
    render: createFixtureAction(ToggleButton),
    getProps: context => getCommonProps(context)
  });
}

function getCommonProps(context) {
  const { getConfigOf, getState, setState, callMethod } = context;
  const { projectId }: CoreConfig = getConfigOf('core');

  return {
    state: getState(),
    projectId,
    primaryRendererState: callMethod('renderer.getPrimaryRendererState'),
    validFixtureSelected: context.callMethod('renderer.isValidFixtureSelected'),
    setState,
    setFixtureStateViewport: () => setFixtureStateViewport(context),
    storage: getStorageApi(context)
  };
}

function getStorageApi({ callMethod }) {
  return {
    getItem: key => callMethod('storage.getItem', key),
    setItem: (key, value) => callMethod('storage.setItem', key, value)
  };
}

function setFixtureStateViewport({ getState, callMethod }) {
  const { enabled, viewport } = getState();

  callMethod('renderer.setFixtureState', fixtureState => ({
    ...fixtureState,
    viewport: enabled ? viewport : null
  }));
}
