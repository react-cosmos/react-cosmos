import { PlaygroundUrlParams } from 'react-cosmos-core/playground';
import { FixtureId } from 'react-cosmos-core/fixture';

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
