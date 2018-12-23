// @flow

import { registerPlugin } from 'react-plugin';
import { createFixtureAction } from '../FixtureHeader/createFixtureAction';
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
      return {
        config: context.getConfig(),
        ...getCommonProps(context)
      };
    }
  });

  plug({
    slotName: 'fixtureActions',
    render: createFixtureAction(ToggleButton),
    getProps: context => {
      return getCommonProps(context);
    }
  });
}

function getCommonProps(context) {
  const { getConfigOf, getState, getStateOf, setState, callMethod } = context;
  const { projectId }: CoreConfig = getConfigOf('core');
  const { urlParams }: RouterState = getStateOf('router');

  return {
    state: getState(),
    projectId,
    urlParams,
    primaryRendererState: callMethod('renderer.getPrimaryRendererState'),
    isFixturePathValid: (fixturePath: string): boolean =>
      callMethod('renderer.isFixturePathValid', fixturePath),
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
