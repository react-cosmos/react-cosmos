import { MessageType } from 'react-cosmos-core';

export type MessageHandlerSpec = {
  name: 'messageHandler';
  methods: {
    postRendererRequest(msg: MessageType): unknown;
  };
  events: {
    serverMessage(msg: MessageType): void;
    rendererResponse(msg: MessageType): void;
  };
};
