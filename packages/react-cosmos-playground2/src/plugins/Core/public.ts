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
    commands: Record<string, () => unknown>;
  };
  methods: {
    registerCommands(commands: Record<string, () => unknown>): () => void;
    runCommand(name: string): unknown;
    getProjectId(): string;
    getFixtureFileVars(): { fixturesDir: string; fixtureFileSuffix: string };
    isDevServerOn(): boolean;
    getWebRendererUrl(): null | string;
  };
};
