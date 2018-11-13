// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';
import { PlaygroundContext } from '../../PlaygroundContext';
import { pushUrlParamsToHistory, subscribeToLocationChanges } from './window';

import type { Node } from 'react';
import type {
  RendererId,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from '../RendererResponseHandler';
import type { RouterState } from './shared';

type Props = {
  children: Node
};

export class Router extends Component<Props> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    return this.props.children;
  }

  getOwnState(): RouterState {
    return this.context.getState('router');
  }

  setOwnState(state: RouterState, cb?: Function) {
    this.context.setState('router', state, cb);
  }

  unsubscribeFromUrlChanges = () => {};
  unsubscribeFromRendererResponses = () => {};
  unregisterMethods = () => {};

  componentDidMount() {
    this.unsubscribeFromUrlChanges = subscribeToLocationChanges(
      this.handleLocationChange
    );

    const { registerMethods, addEventListener } = this.context;
    this.unsubscribeFromRendererResponses = addEventListener(
      'renderer.response',
      this.handleRendererResponse
    );
    this.unregisterMethods = registerMethods({
      'router.setUrlParams': this.handleSetUrlParams
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromUrlChanges();
    this.unsubscribeFromRendererResponses();
    this.unregisterMethods();
  }

  handleLocationChange = (urlParams: RouterState) => {
    const { fixture } = this.getOwnState();
    const hasFixtureChanged = urlParams.fixture !== fixture;

    this.setOwnState(urlParams, () => {
      if (hasFixtureChanged) {
        this.renderCurrentFixture();
      }
    });
  };

  handleRendererResponse = (msg: RendererResponse) => {
    const { fixture } = this.getOwnState();

    if (msg.type === 'fixtureList' && fixture) {
      const { rendererId } = msg.payload;
      this.postSelectFixtureRequest(rendererId, fixture);
    }
  };

  handleSetUrlParams = (nextUrlParams: RouterState) => {
    const urlParams = this.getOwnState();
    const hasFixtureChanged = nextUrlParams.fixture !== urlParams.fixture;
    const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

    this.setOwnState(nextUrlParams, () => {
      // Setting identical url params is considered a "reset" request
      if (hasFixtureChanged || areUrlParamsEqual) {
        this.renderCurrentFixture();
      }
      pushUrlParamsToHistory(this.context.getState('router'));
    });
  };

  renderCurrentFixture() {
    const { rendererIds }: RendererState = this.context.getState('renderer');
    const { fixture } = this.getOwnState();

    rendererIds.forEach(rendererId => {
      this.postSelectFixtureRequest(rendererId, fixture || null);
    });
  }

  postSelectFixtureRequest(rendererId: RendererId, fixturePath: string | null) {
    const { emitEvent } = this.context;

    emitEvent('renderer.request', {
      type: 'selectFixture',
      payload: {
        rendererId,
        fixturePath
      }
    });
  }
}
