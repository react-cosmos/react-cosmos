import * as React from 'react';
import {
  RendererRequest,
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { ConnectRenderCb } from '../shared';

export type Props = {
  children: ConnectRenderCb;
};

export class PostMessage extends React.Component<Props> {
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
