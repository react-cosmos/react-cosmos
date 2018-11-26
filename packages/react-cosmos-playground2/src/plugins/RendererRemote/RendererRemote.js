// @flow

import { Component } from 'react';
import io from 'socket.io-client';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import { PluginContext } from '../../plugin';

import type { Socket } from 'socket.io-client';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { PluginContextValue } from '../../plugin';

export class RendererRemote extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  socket: ?Socket;

  removeRendererRequestListener = () => {};

  render() {
    return null;
  }

  componentDidMount() {
    const { addEventListener, emitEvent } = this.context;

    this.socket = io();
    this.socket.on(RENDERER_MESSAGE_EVENT_NAME, this.handleMessage);

    this.removeRendererRequestListener = addEventListener(
      'renderer.request',
      this.postMessage
    );

    // Discover remote renderers by asking all to share their fixture list
    emitEvent('renderer.request', {
      type: 'requestFixtureList'
    });
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
