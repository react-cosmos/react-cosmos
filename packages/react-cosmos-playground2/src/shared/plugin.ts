export const DEFAULT_PLUGIN_CONFIG = {
  layout: {
    globalOrder: ['fixtureSearch', 'notifications']
  },
  nav: {
    navRowOrder: ['fixtureSearch', 'fixtureTree']
  },
  rendererHeader: {
    rendererActionOrder: [
      'remoteRenderer',
      'fullScreen',
      'responsivePreview',
      'controlPanel'
    ]
  },
  controlPanel: {
    controlPanelRowOrder: ['props', 'classState']
  }
};
