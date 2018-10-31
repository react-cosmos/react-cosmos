/* eslint-env browser */
// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../../context';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type {
  UiState,
  ReplaceFixtureState,
  RendererRequestListener
} from '../../index.js.flow';

type Props = {
  rendererUrl: string,
  uiState: UiState,
  fixtureState: ?FixtureState,
  setUiState: SetState<UiState>,
  onRendererRequest: (listener: RendererRequestListener) => () => mixed,
  replaceFixtureState: ReplaceFixtureState
};

class IframePreview extends Component<Props> {
  iframeRef: ?window;

  unsubscribe: ?() => mixed;

  render() {
    const { rendererUrl } = this.props;

    return (
      <Iframe ref={this.handleIframeRef} src={rendererUrl} frameBorder={0} />
    );
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage, false);

    this.unsubscribe = this.props.onRendererRequest(this.postIframeMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage, false);

    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  handleIframeRef = (iframeRef: ?window) => {
    this.iframeRef = iframeRef;
  };

  // TODO:
  // - handleAnyMessage
  // - handleCosmosMessage
  handleMessage = ({ data }: { data: RendererResponse }) => {
    const { uiState, setUiState, replaceFixtureState } = this.props;

    switch (data.type) {
      case 'fixtureList': {
        const { rendererId, fixtures } = data.payload;
        const { renderers } = uiState;

        return setUiState({
          renderers:
            renderers.indexOf(rendererId) === -1
              ? [...renderers, rendererId]
              : renderers,
          fixtures
        });
      }
      case 'fixtureState': {
        const { fixtureState } = data.payload;

        return replaceFixtureState(fixtureState);
      }
      default:
      // It's common for unrelated messages to be intercepted. No need to make
      // a fuss about it, though. Except, yeah, the type on this method's
      // arguments is wrong. The incoming message should be typed as a generic
      // object type and the RendererResponse type should be ensured via type
      // refinements. But instead of doing that I wrote this comment. Peace.
    }
  };

  postIframeMessage = (msg: RendererRequest) => {
    if (this.iframeRef) {
      this.iframeRef.contentWindow.postMessage(msg, '*');
    }
  };
}

// The root <Slot name="preview"> allows other plugins to further decorate
// the "preview" plugin slot.
register(
  <Plugin name="Preview">
    <Plug
      slot="preview"
      render={() => (
        <Slot name="preview">
          <PlaygroundContext.Consumer>
            {({
              options,
              uiState,
              setUiState,
              fixtureState,
              replaceFixtureState,
              onRendererRequest
            }) => (
              <IframePreview
                rendererUrl={options.rendererUrl}
                uiState={uiState}
                fixtureState={fixtureState}
                setUiState={setUiState}
                replaceFixtureState={replaceFixtureState}
                onRendererRequest={onRendererRequest}
              />
            )}
          </PlaygroundContext.Consumer>
        </Slot>
      )}
    />
  </Plugin>
);

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  background: #f1f1f1;
`;
