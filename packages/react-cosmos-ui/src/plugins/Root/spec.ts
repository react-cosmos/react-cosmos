export type RootSpec = {
  name: 'root';
  config: {
    globalActionOrder: string[];
    globalOrder: string[];
    navPanelRowOrder: string[];
    controlPanelRowOrder: string[];
    fixtureActionOrder: string[];
    rendererActionOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
  methods: {
    arePanelsLocked: () => boolean;
    closeNavPanel: () => void;
  };
};
