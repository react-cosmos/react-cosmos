import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { Layout } from './Layout';
import { isNavOpen, openNav } from './navOpen';
import { getNavWidthApi } from './navWidth';
import { isPanelOpen, openPanel } from './panelOpen';
import { getPanelWidthApi } from './panelWidth';
import { LayoutSpec } from './public';

const { onLoad, plug, register } = createPlugin<LayoutSpec>({
  name: 'layout',
  initialState: {
    storageCacheReady: false
  },
  methods: {
    isNavOpen,
    isPanelOpen,
    openNav,
    openPanel
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
        panelOpen={false}
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
      panelOpen={isPanelOpen(pluginContext)}
      navWidth={navWidth}
      panelWidth={panelWidth}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
    />
  );
});

export { register };
