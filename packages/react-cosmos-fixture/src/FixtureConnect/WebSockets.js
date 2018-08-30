/* eslint-env browser */
// @flow

import { Component } from 'react';
import io from 'socket.io-client';

import type { Socket } from 'socket.io-client';
import type {
  RendererMessage,
  RemoteMessage,
  OnRemoteMessage
} from 'react-cosmos-shared2';
import type { WebSocketsProps } from '../../types';

export const EVENT_NAME = 'cosmos-cmd';

export class WebSockets extends Component<WebSocketsProps> {
  socket: ?Socket;
  onMessage: ?OnRemoteMessage = null;

  render() {
    const { children } = this.props;
    const { subscribe, unsubscribe, postMessage } = this;

    return children({
      subscribe,
      unsubscribe,
      postMessage
    });
  }

  handleMessage = (msg: RemoteMessage) => {
    if (this.onMessage) {
      this.onMessage(msg);
    }
  };

  subscribe = (onMessage: OnRemoteMessage) => {
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

  postMessage = (msg: RendererMessage) => {
    if (this.socket) {
      this.socket.emit(EVENT_NAME, msg);
    }
  };
}
