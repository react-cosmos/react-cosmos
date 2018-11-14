// @flow

import { Component } from 'react';
import io from 'socket.io-client';
import { PlaygroundContext } from '../../PlaygroundContext';

import type { Socket } from 'socket.io-client';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { PlaygroundContextValue } from '../../index.js.flow';

export const RENDERER_MESSAGE_EVENT_NAME = 'cosmos-renderer-message';

export class RendererRemote extends Component<{}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  socket: ?Socket;

  removeRendererRequestListener = () => {};

  render() {
    return null;
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on(RENDERER_MESSAGE_EVENT_NAME, this.handleMessage);

    this.removeRendererRequestListener = this.context.addEventListener(
      'renderer.request',
      this.postMessage
    );
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.off(RENDERER_MESSAGE_EVENT_NAME, this.handleMessage);
    }

    this.removeRendererRequestListener();
  }

  handleMessage = (msg: Object) => {
    // TODO: Validate
    this.context.emitEvent('renderer.response', msg);
  };

  postMessage = (msg: RendererRequest) => {
    if (this.socket) {
      this.socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    }
  };
}
