import { Message } from '../../util';

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
