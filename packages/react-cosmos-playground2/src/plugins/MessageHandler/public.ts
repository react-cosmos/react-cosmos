import { Message } from 'react-cosmos-shared2/util';

export type MessageHandlerSpec = {
  name: 'messageHandler';
  methods: {
    postRendererRequest(msg: Message): unknown;
  };
  events: {
    serverMessage(msg: Message): void;
    rendererResponse(msg: Message): void;
  };
};
