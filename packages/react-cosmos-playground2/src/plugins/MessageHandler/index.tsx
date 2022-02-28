import { MessageHandlerSpec } from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import { initSocket, postRendererRequest } from './socket';

const { onLoad, register } = createPlugin<MessageHandlerSpec>({
  name: 'messageHandler',
  methods: {
    postRendererRequest,
  },
});

onLoad(initSocket);

register();
