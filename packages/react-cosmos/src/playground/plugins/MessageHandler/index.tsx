import { createPlugin } from 'react-plugin';
import { initSocket, postRendererRequest } from './socket.js';
import { MessageHandlerSpec } from './spec.js';

const { onLoad, register } = createPlugin<MessageHandlerSpec>({
  name: 'messageHandler',
  methods: {
    postRendererRequest,
  },
});

onLoad(initSocket);

register();
