import { FixtureId } from 'react-cosmos-shared2/renderer';
import { UrlParams } from '../../shared/router';

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
