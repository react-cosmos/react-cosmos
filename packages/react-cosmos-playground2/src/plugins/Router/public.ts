import { FixtureId } from 'react-cosmos-shared2/renderer';
import { PlaygroundUrlParams } from 'react-cosmos-shared2/url';

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: PlaygroundUrlParams;
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
