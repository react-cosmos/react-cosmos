/* eslint-env browser */
// @flow

import { Component } from 'react';
import io from 'socket.io-client';

import type { Socket } from 'socket.io-client';
import type {
  RendererRequest,
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { WebSocketsProps } from '../../types';

export const EVENT_NAME = 'cosmos-cmd';

export class WebSockets extends Component<WebSocketsProps> {
  socket: ?Socket;
  onMessage: ?OnRendererRequest = null;

  render() {
    const { children } = this.props;
    const { subscribe, unsubscribe, postMessage } = this;

    return children({
      subscribe,
      unsubscribe,
      postMessage
    });
  }

  handleMessage = (msg: RendererRequest) => {
    if (this.onMessage) {
      this.onMessage(msg);
    }
  };

  subscribe = (onMessage: OnRendererRequest) => {
    this.onMessage = onMessage;

    this.socket = io(this.props.url);
    this.socket.on(EVENT_NAME, this.handleMessage);
  };

  unsubscribe = () => {
    if (this.socket) {
      this.socket.off(EVENT_NAME, this.handleMessage);

      this.socket = null;
      this.onMessage = null;
    }
  };

  postMessage = (msg: RendererResponse) => {
    if (this.socket) {
      this.socket.emit(EVENT_NAME, msg);
    }
  };
}
