import { BuildMessage } from 'react-cosmos-shared2/build';
import {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';

export type MessageHandlerSpec = {
  name: 'messageHandler';
  methods: {
    postRendererRequest(msg: RendererRequest): unknown;
  };
  events: {
    buildMessage(msg: BuildMessage): void;
    rendererResponse(msg: RendererResponse): void;
  };
};
