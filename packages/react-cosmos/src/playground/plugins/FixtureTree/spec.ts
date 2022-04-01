import { FixtureId } from '../../../core/types.js';

export type FixtureTreeSpec = {
  name: 'fixtureTree';
  methods: {
    revealFixture: (fixtureId: FixtureId) => unknown;
  };
};
