export type LayoutSpec = {
  name: 'layout';
  state: {
    storageCacheReady: boolean;
  };
  methods: {
    isPanelOpen(): boolean;
    openPanel(open: boolean): unknown;
  };
};
