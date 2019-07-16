import { FixtureId } from 'react-cosmos-shared2/renderer';

export type FixtureTreeSpec = {
  name: 'fixtureTree';
  methods: {
    revealFixture: (fixtureId: FixtureId) => unknown;
  };
};
