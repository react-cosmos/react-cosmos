/* eslint-env browser */
// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';

import type {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';

class IframePreview extends Component<{}> {
  static contextType = PlaygroundContext;

  iframeRef: ?window;

  unsubscribe: ?() => mixed;

  render() {
    const {
      options: { rendererUrl }
    } = this.context;

    return (
      <Iframe
        data-testid="preview-iframe"
        ref={this.handleIframeRef}
        src={rendererUrl}
        frameBorder={0}
      />
    );
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage, false);

    this.unsubscribe = this.context.onRendererRequest(this.postIframeMessage);
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
    const { uiState, setUiState, replaceFixtureState } = this.context;

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
          <IframePreview />
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
