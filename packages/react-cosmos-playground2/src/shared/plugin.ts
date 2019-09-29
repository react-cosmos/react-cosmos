export const DEFAULT_PLUGIN_CONFIG = {
  layout: {
    globalOrder: ['fixtureSearch', 'notifications'],
    topBarRightActionOrder: ['remoteRenderer'],
    rendererActionOrder: [
      'editFixture',
      'controlPanel',
      'responsivePreview',
      'fullScreen'
    ],
    rendererPanelRowOrder: ['props', 'classState']
  },
  nav: {
    navRowOrder: ['fixtureSearch', 'fixtureTree']
  }
};
