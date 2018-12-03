// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { PluginContext } from '../../plugin';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { PluginContextValue } from '../../plugin';

type Props = {
  rendererUrl: string
};

export class RendererPreview extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  iframeRef: ?window;

  removeRendererRequestListener = () => {};

  render() {
    const { rendererUrl } = this.props;

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
    // TODO: Validate message shape
    // TODO: Filter out alien messages (maybe tag msgs with source: "cosmos")
    // TODO: https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
    this.context.emitEvent('renderer.response', msg.data);
  };

  postIframeMessage = (msg: RendererRequest) => {
    if (this.iframeRef) {
      this.iframeRef.contentWindow.postMessage(msg, '*');
    }
  };
}

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background-color: #fff;
  /* Checkerboard effect on background */
  background-image: linear-gradient(
      45deg,
      #f8f8f8 25%,
      transparent 25%,
      transparent 75%,
      #f8f8f8 75%,
      #f8f8f8 100%
    ),
    linear-gradient(
      45deg,
      #f8f8f8 25%,
      transparent 25%,
      transparent 75%,
      #f8f8f8 75%,
      #f8f8f8 100%
    );
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
`;
