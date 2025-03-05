export const DEFAULT_PLUGIN_CONFIG = {
  root: {
    globalActionOrder: ['remoteRenderer'],
    globalOrder: ['fixtureSearch', 'notifications'],
    navPanelRowOrder: ['fixtureSearch', 'fixtureBookmarks', 'fixtureTree'],
    controlPanelRowOrder: ['inputs', 'props', 'classState'],
    fixtureActionOrder: ['bookmarkFixture'],
    rendererActionOrder: ['openFixture', 'fullScreen', 'responsivePreview'],
  },
  inputsPanel: {
    actionOrder: ['expandCollapse'],
  },
};
