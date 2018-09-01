/* eslint-env browser */
// @flow

import { Component } from 'react';

import type {
  RendererRequest,
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { PostMessageProps } from '../../types';

export class PostMessage extends Component<PostMessageProps> {
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

  handleMessage = (msg: { data: RendererRequest }) => {
    if (this.onMessage) {
      this.onMessage(msg.data);
    }
  };

  subscribe = (onMessage: OnRendererRequest) => {
    this.onMessage = onMessage;
    window.addEventListener('message', this.handleMessage, false);
  };

  unsubscribe = () => {
    window.removeEventListener('message', this.handleMessage);
    this.onMessage = null;
  };

  postMessage = (msg: RendererResponse) => {
    parent.postMessage(msg, '*');
  };
}
