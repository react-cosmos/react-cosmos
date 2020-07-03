export type RootSpec = {
  name: 'root';
  config: {
    controlPanelRowOrder: string[];
    globalActionOrder: string[];
    globalOrder: string[];
    navRowOrder: string[];
    fixtureActionOrder: string[];
    rendererActionOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
};
