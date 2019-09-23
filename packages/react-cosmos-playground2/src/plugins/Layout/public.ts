export type LayoutSpec = {
  name: 'layout';
  config: {
    globalOrder: string[];
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
