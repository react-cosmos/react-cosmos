export type RootSpec = {
  name: 'root';
  config: {
    globalOrder: string[];
    globalActionOrder: string[];
    rendererActionOrder: string[];
    controlPanelRowOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
};
