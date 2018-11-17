// @flow

import { Component } from 'react';
import { isEqual } from 'lodash';
import { PlaygroundContext } from '../../PlaygroundContext';
import { pushUrlParamsToHistory, subscribeToLocationChanges } from './window';

import type {
  RendererId,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from '../RendererMessageHandler';
import type { UrlParams } from './shared';

export class Router extends Component<{}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

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

  handleLocationChange = (urlParams: UrlParams) => {
    const { fixturePath } = this.getOwnState();
    const hasFixtureChanged = urlParams.fixturePath !== fixturePath;

    this.setOwnState(urlParams, () => {
      if (hasFixtureChanged) {
        this.renderCurrentFixture();
      }
    });
  };

  handleRendererResponse = (msg: RendererResponse) => {
    const { fixturePath } = this.getOwnState();

    if (msg.type === 'fixtureList' && fixturePath) {
      const { rendererId } = msg.payload;
      this.postSelectFixtureRequest(rendererId, fixturePath);
    }
  };

  handleSetUrlParams = (nextUrlParams: UrlParams) => {
    const urlParams = this.getOwnState();
    const hasFixtureChanged =
      nextUrlParams.fixturePath !== urlParams.fixturePath;
    const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

    this.setOwnState(nextUrlParams, () => {
      // Setting identical url params is considered a "reset" request
      if (hasFixtureChanged || areUrlParamsEqual) {
        this.renderCurrentFixture();
      }
      pushUrlParamsToHistory(this.getOwnState());
    });
  };

  renderCurrentFixture() {
    const { rendererIds }: RendererState = this.context.getState('renderer');
    const { fixturePath } = this.getOwnState();

    rendererIds.forEach(rendererId => {
      this.postSelectFixtureRequest(rendererId, fixturePath || null);
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
