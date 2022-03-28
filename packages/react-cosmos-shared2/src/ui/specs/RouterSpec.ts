import { FixtureId } from '../../renderer';
import { PlaygroundUrlParams } from '../../url';

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
