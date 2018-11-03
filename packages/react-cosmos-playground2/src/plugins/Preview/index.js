/* eslint-env browser */
// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';

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
    window.addEventListener('message', this.handleWindowMsg, false);

    this.unsubscribe = this.context.onRendererRequest(this.postIframeMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMsg, false);

    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  handleIframeRef = (iframeRef: ?window) => {
    this.iframeRef = iframeRef;
  };

  handleWindowMsg = msg => {
    // TODO: Validate
    this.context.receiveRendererResponse(msg.data);
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
