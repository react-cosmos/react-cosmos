import { PlaygroundUrlParams } from '../../../core/playgroundUrl';
import { FixtureId } from '../../../renderer/types';

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
