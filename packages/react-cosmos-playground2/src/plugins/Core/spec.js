// @flow

export type CoreSpec = {
  name: 'core',
  config: {
    projectId: string,
    fixturesDir: string,
    fixtureFileSuffix: string
  },
  methods: {
    getProjectId(): string,
    getFixtureFileVars(): { fixturesDir: string, fixtureFileSuffix: string }
  }
};
