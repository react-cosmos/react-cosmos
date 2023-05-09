import { FixtureId, PlaygroundParams } from 'react-cosmos-core';

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundParams;
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
