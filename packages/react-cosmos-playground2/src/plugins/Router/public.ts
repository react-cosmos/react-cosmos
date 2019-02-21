import { FixtureId } from 'react-cosmos-shared2/renderer';

export type UrlParams = {
  fixtureId?: FixtureId;
  fullScreen?: boolean;
};

export type RouterSpec = {
  name: 'router';
  state: {
    urlParams: UrlParams;
  };
  methods: {
    getSelectedFixtureId(): null | FixtureId;
    isFullScreen(): boolean;
    selectFixture(fixtureId: FixtureId, fullScreen: boolean): void;
    unselectFixture(): void;
  };
  events: {
    fixtureChange(fixtureId: null | FixtureId): void;
  };
};
