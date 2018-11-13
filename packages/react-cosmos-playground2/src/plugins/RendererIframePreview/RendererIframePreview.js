/* eslint-env browser */
// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';

export class RendererIframePreview extends Component<{}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  iframeRef: ?window;

  removeRendererRequestListener = () => {};

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

    this.removeRendererRequestListener = this.context.addEventListener(
      'renderer.request',
      this.postIframeMessage
    );
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMsg, false);

    this.removeRendererRequestListener();
  }

  handleIframeRef = (iframeRef: ?window) => {
    this.iframeRef = iframeRef;
  };

  handleWindowMsg = (msg: Object) => {
    // TODO: Validate
    this.context.emitEvent('renderer.response', msg.data);
  };

  postIframeMessage = (msg: RendererRequest) => {
    if (this.iframeRef) {
      this.iframeRef.contentWindow.postMessage(msg, '*');
    }
  };
}

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  background: #f1f1f1;
`;
