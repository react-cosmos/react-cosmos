export type LayoutSpec = {
  name: 'layout';
  config: {
    globalOrder: string[];
    topBarRightActionOrder: string[];
    rendererActionOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
  methods: {
    isNavOpen(): boolean;
    isPanelOpen(): boolean;
    openNav(open: boolean): unknown;
    openPanel(open: boolean): unknown;
  };
};
