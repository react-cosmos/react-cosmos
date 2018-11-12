// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import {
  getUrlParamsFromLocation,
  pushUrlParamsToHistory,
  subscribeToLocationChanges
} from './window';

import type { Node } from 'react';
import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { UrlParams } from './shared';
import type { PlaygroundContextValue } from '../../index.js.flow';

type Props = {
  children: Node
};

class Router extends Component<Props> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    return <Slot name="root">{this.props.children}</Slot>;
  }

  unsubscribeFromUrlChanges = () => {};
  unsubscribeFromRendererResponses = () => {};
  unregisterMethods = () => {};

  componentDidMount() {
    const { setState, registerMethods, addEventListener } = this.context;

    this.unsubscribeFromUrlChanges = subscribeToLocationChanges(
      this.handleLocationChange
    );
    this.unsubscribeFromRendererResponses = addEventListener(
      'renderer.onResponse',
      this.handleRendererResponse
    );
    this.unregisterMethods = registerMethods({
      'router.setUrlParams': this.handleSetUrlParams
    });

    // TODO(vision): Expose this so that the initial state is set before first
    // render
    setState('router', getUrlParamsFromLocation());
  }

  componentWillUnmount() {
    this.unsubscribeFromUrlChanges();
    this.unsubscribeFromRendererResponses();
    this.unregisterMethods();
  }

  handleLocationChange = (urlParams: UrlParams) => {
    const { fixture } = this.context.state.router;
    const hasFixtureChanged = urlParams.fixture !== fixture;

    this.context.setState('router', urlParams, () => {
      if (hasFixtureChanged) {
        this.renderCurrentFixture();
      }
    });
  };

  handleRendererResponse = (msg: RendererResponse) => {
    const { fixture } = this.context.state.router;

    if (msg.type === 'fixtureList' && fixture) {
      const { rendererId } = msg.payload;
      this.postSelectFixtureRequest(rendererId, fixture);
    }
  };

  handleSetUrlParams = (nextUrlParams: UrlParams) => {
    const urlParams = this.context.state.router;
    const hasFixtureChanged = nextUrlParams.fixture !== urlParams.fixture;
    const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

    this.context.setState('router', nextUrlParams, () => {
      // Setting identical url params is considered a "reset" request
      if (hasFixtureChanged || areUrlParamsEqual) {
        this.renderCurrentFixture();
      }
      pushUrlParamsToHistory(this.context.state.router);
    });
  };

  renderCurrentFixture() {
    const { renderers } = this.context.state.core;
    const { fixture } = this.context.state.router;

    renderers.forEach(rendererId => {
      this.postSelectFixtureRequest(rendererId, fixture || null);
    });
  }

  postSelectFixtureRequest(rendererId, fixturePath) {
    const { callMethod } = this.context;

    callMethod('renderer.postRequest', {
      type: 'selectFixture',
      payload: {
        rendererId,
        fixturePath
      }
    });
  }
}

register(
  <Plugin name="Router">
    <Plug slot="root" render={Router} />
  </Plugin>
);
