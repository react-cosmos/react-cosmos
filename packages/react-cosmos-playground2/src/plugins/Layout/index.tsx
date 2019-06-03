import React from 'react';
import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { LayoutSpec } from './public';
import { Layout } from './Layout';
import { getNavWidthApi, getPanelWidthApi } from './shared';

const { onLoad, plug, register } = createPlugin<LayoutSpec>({
  name: 'layout',
  initialState: {
    storageCacheReady: false
  }
});

onLoad(context => {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const core = context.getMethodsOf<CoreSpec>('core');
  storage.loadCache(core.getProjectId()).then(() => {
    context.setState({ storageCacheReady: true });
  });
});

plug('root', ({ pluginContext }) => {
  const { getState, getMethodsOf } = pluginContext;
  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Layout
        storageCacheReady={false}
        fullScreen={false}
        navWidth={0}
        panelWidth={0}
        setNavWidth={() => {}}
        setPanelWidth={() => {}}
      />
    );
  }

  const router = getMethodsOf<RouterSpec>('router');
  const { navWidth, setNavWidth } = getNavWidthApi(pluginContext);
  const { panelWidth, setPanelWidth } = getPanelWidthApi(pluginContext);
  return (
    <Layout
      storageCacheReady={true}
      fullScreen={router.isFullScreen()}
      navWidth={navWidth}
      panelWidth={panelWidth}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
    />
  );
});

export { register };
