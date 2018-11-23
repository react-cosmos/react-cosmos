// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';
import { PluginContext } from '../../plugin';
import { pushUrlParamsToHistory, subscribeToLocationChanges } from './window';

import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from './shared';

export class Router extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    return null;
  }

  getOwnState(): UrlParams {
    return this.context.getState('urlParams');
  }

  setOwnState(state: UrlParams, cb?: Function) {
    this.context.setState('urlParams', state, cb);
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
    const { fixturePath } = this.getOwnState();
    const hasFixtureChanged = urlParams.fixturePath !== fixturePath;

    this.setOwnState(urlParams, () => {
      if (hasFixtureChanged) {
        this.selectCurrentFixture();
      }
    });
  };

  handleSetUrlParams = (nextUrlParams: UrlParams) => {
    const urlParams = this.getOwnState();
    const hasFixtureChanged =
      nextUrlParams.fixturePath !== urlParams.fixturePath;
    const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

    this.setOwnState(nextUrlParams, () => {
      // Setting identical url params is considered a "reset" request
      if (hasFixtureChanged || areUrlParamsEqual) {
        this.selectCurrentFixture();
      }

      if (!areUrlParamsEqual) {
        pushUrlParamsToHistory(this.getOwnState());
      }
    });
  };

  selectCurrentFixture() {
    const { fixturePath } = this.getOwnState();

    if (!fixturePath) {
      return this.context.callMethod('renderer.unselectFixture');
    }

    this.context.callMethod('renderer.selectFixture', fixturePath);
  }
}
