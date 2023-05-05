import { FixtureId, PlaygroundQueryParams } from 'react-cosmos-core';

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundQueryParams;
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
