import { FixtureId, PlaygroundSearchParams } from 'react-cosmos-core';

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundSearchParams;
  };
  methods: {
    getSelectedFixtureId(): null | FixtureId;
    selectFixture(fixtureId: FixtureId): void;
    unselectFixture(): void;
  };
  events: {
    fixtureChange(fixtureId: null | FixtureId): void;
  };
};
