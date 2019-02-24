export type CoreSpec = {
  name: 'core';
  config: {
    projectId: string;
    fixturesDir: string;
    fixtureFileSuffix: string;
    devServerOn: boolean;
    webRendererUrl: null | string;
  };
  methods: {
    getProjectId(): string;
    getFixtureFileVars(): { fixturesDir: string; fixtureFileSuffix: string };
    isDevServerOn(): boolean;
    getWebRendererUrl(): null | string;
  };
};
