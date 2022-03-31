export type Commands = Record<string, () => unknown>;

export type CoreSpec = {
  name: 'core';
  config: {
    projectId: string;
    fixturesDir: string;
    fixtureFileSuffix: string;
    devServerOn: boolean;
    webRendererUrl: null | string;
  };
  state: {
    commands: Commands;
  };
  methods: {
    registerCommands(commands: Commands): () => void;
    runCommand(name: string): unknown;
    getProjectId(): string;
    getFixtureFileVars(): { fixturesDir: string; fixtureFileSuffix: string };
    isDevServerOn(): boolean;
    getWebRendererUrl(): null | string;
  };
};
