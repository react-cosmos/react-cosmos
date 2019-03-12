import * as React from 'react';
import * as io from 'socket.io-client';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import {
  RendererRequest,
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { WebSocketsProps } from '../shared';

export class WebSockets extends React.Component<WebSocketsProps> {
  socket: null | typeof io.Socket = null;
  onMessage: null | OnRendererRequest = null;

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
    this.socket.on(RENDERER_MESSAGE_EVENT_NAME, this.handleMessage);
  };

  unsubscribe = () => {
    if (this.socket) {
      this.socket.off(RENDERER_MESSAGE_EVENT_NAME, this.handleMessage);
      this.socket = null;
      this.onMessage = null;
    }
  };

  postMessage = (msg: RendererResponse) => {
    if (this.socket) {
      this.socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    }
  };
}
