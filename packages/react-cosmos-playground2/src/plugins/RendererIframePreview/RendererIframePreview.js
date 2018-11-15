/* eslint-env browser */
// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';

type Props = {
  rendererPreviewUrl: string
};

export class RendererIframePreview extends Component<Props> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  iframeRef: ?window;

  removeRendererRequestListener = () => {};

  render() {
    const { rendererPreviewUrl } = this.props;

    return (
      <Iframe
        data-testid="preview-iframe"
        ref={this.handleIframeRef}
        src={rendererPreviewUrl}
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
