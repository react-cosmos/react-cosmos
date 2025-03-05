export type RootSpec = {
  name: 'root';
  config: {
    sidePanelRowOrder: string[];
    globalActionOrder: string[];
    globalOrder: string[];
    navRowOrder: string[];
    fixtureActionOrder: string[];
    rendererActionOrder: string[];
  };
  state: {
    storageCacheReady: boolean;
  };
  methods: {
    arePanelsLocked: () => boolean;
    closeFixtureList: () => void;
  };
};
