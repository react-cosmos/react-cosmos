// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';
import { PluginContext } from '../../plugin';
import { pushUrlParamsToHistory, subscribeToLocationChanges } from './window';

import type { StateUpdater } from 'react-cosmos-shared2/util';
import type { PluginContextValue } from '../../plugin';
import type { UrlParams, RouterState } from './shared';

export class Router extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    return null;
  }

  getOwnState(): RouterState {
    return this.context.getState('router');
  }

  setOwnState(stateChange: StateUpdater<RouterState>, cb?: Function) {
    this.context.setState('router', stateChange, cb);
  }

  getUrlParams(): UrlParams {
    return this.getOwnState().urlParams;
  }

  setUrlParams(urlParams: UrlParams, cb?: Function) {
    this.setOwnState(prevState => ({ ...prevState, urlParams }), cb);
  }

  unsubscribeFromUrlChanges = () => {};
  unregisterMethods = () => {};

  componentDidMount() {
    this.unsubscribeFromUrlChanges = subscribeToLocationChanges(
      this.handleLocationChange
    );

    this.unregisterMethods = this.context.registerMethods({
      'router.setUrlParams': this.handleSetUrlParams
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromUrlChanges();
    this.unregisterMethods();
  }

  handleLocationChange = (urlParams: UrlParams) => {
    const { fixturePath } = this.getUrlParams();
    const hasFixtureChanged = urlParams.fixturePath !== fixturePath;

    this.setUrlParams(urlParams, () => {
      if (hasFixtureChanged) {
        this.selectCurrentFixture();
      }
    });
  };

  handleSetUrlParams = (nextUrlParams: UrlParams) => {
    const urlParams = this.getUrlParams();
    const hasFixtureChanged =
      nextUrlParams.fixturePath !== urlParams.fixturePath;
    const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

    this.setUrlParams(nextUrlParams, () => {
      // Setting identical url params is considered a "reset" request
      if (hasFixtureChanged || areUrlParamsEqual) {
        this.selectCurrentFixture();
      }

      if (!areUrlParamsEqual) {
        pushUrlParamsToHistory(this.getUrlParams());
      }
    });
  };

  selectCurrentFixture() {
    const { fixturePath } = this.getUrlParams();

    if (!fixturePath) {
      return this.context.callMethod('renderer.unselectFixture');
    }

    this.context.callMethod('renderer.selectFixture', fixturePath);
  }
}
