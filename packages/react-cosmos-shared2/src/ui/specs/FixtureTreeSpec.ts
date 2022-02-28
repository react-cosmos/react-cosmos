import { FixtureId } from '../../renderer';

export type FixtureTreeSpec = {
  name: 'fixtureTree';
  methods: {
    revealFixture: (fixtureId: FixtureId) => unknown;
  };
};
