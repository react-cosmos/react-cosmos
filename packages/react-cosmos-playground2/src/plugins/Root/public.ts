export type RootSpec = {
  name: 'root';
  config: {
    globalOrder: string[];
    topBarRightActionOrder: string[];
    rendererActionOrder: string[];
    controlPanelRowOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
};
