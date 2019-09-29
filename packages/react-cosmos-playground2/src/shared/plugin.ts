export const DEFAULT_PLUGIN_CONFIG = {
  layout: {
    globalOrder: ['fixtureSearch', 'notifications'],
    topBarRightActionOrder: ['remoteRenderer'],
    rendererActionOrder: [
      'editFixture',
      'controlPanel',
      'responsivePreview',
      'fullScreen'
    ]
  },
  nav: {
    navRowOrder: ['fixtureSearch', 'fixtureTree']
  },
  controlPanel: {
    controlPanelRowOrder: ['props', 'classState']
  }
};
