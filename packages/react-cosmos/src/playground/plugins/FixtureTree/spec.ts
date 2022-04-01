import { FixtureId } from '../../../core/types';

export type FixtureTreeSpec = {
  name: 'fixtureTree';
  methods: {
    revealFixture: (fixtureId: FixtureId) => unknown;
  };
};
