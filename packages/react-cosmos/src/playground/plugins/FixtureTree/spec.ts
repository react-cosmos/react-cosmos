import { FixtureId } from 'react-cosmos-core';

export type FixtureTreeSpec = {
  name: 'fixtureTree';
  methods: {
    revealFixture: (fixtureId: FixtureId) => unknown;
  };
};
