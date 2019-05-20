import { createPlugin } from 'react-plugin';
import { MessageHandlerSpec } from './public';
import { initSocket, postRendererRequest } from './socket';

const { onLoad, register } = createPlugin<MessageHandlerSpec>({
  name: 'messageHandler',
  methods: {
    postRendererRequest
  }
});

onLoad(initSocket);

export { register };
