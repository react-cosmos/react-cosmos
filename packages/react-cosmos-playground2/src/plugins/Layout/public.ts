export type LayoutSpec = {
  name: 'layout';
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
