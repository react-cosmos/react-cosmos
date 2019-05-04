export type CoreSpec = {
  name: 'core';
  state: {
    storageCacheReady: boolean;
  };
  config: {
    projectId: string;
    fixturesDir: string;
    fixtureFileSuffix: string;
    devServerOn: boolean;
    webRendererUrl: null | string;
  };
  methods: {
    getFixtureFileVars(): { fixturesDir: string; fixtureFileSuffix: string };
    isDevServerOn(): boolean;
    getWebRendererUrl(): null | string;
  };
};
