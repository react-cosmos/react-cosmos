export const DEFAULT_PLUGIN_CONFIG = {
  layout: {
    globalOrder: ['fixtureSearch', 'notifications'],
    topBarRightActionOrder: ['remoteRenderer']
  },
  nav: {
    navRowOrder: ['fixtureSearch', 'fixtureTree']
  },
  rendererHeader: {
    rendererActionOrder: [
      'editFixture',
      'controlPanel',
      'responsivePreview',
      'fullScreen'
    ]
  },
  controlPanel: {
    controlPanelRowOrder: ['props', 'classState']
  }
};
