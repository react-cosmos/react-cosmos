export type LayoutSpec = {
  name: 'layout';
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
