import {
  RendererConnect,
  RendererRequest,
  RendererResponse,
  SocketMessage,
  rendererSocketMessage,
} from 'react-cosmos-core';

declare global {
  interface Window {
    cosmosRendererResponse?: (msg: RendererResponse) => void;
  }
}

export function createWebSocketsConnect(url: string): RendererConnect {
  let pendingMessages: SocketMessage[] = [];

  const socket = new WebSocket(url);
  socket.addEventListener('open', () => {
    if (pendingMessages.length > 0) {
      pendingMessages.forEach(msg => socket.send(JSON.stringify(msg)));
      pendingMessages = [];
    }
  });

  return {
    postMessage(rendererResponse) {
      const socketMessage = rendererSocketMessage(rendererResponse);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(socketMessage));
      } else {
        pendingMessages.push(socketMessage);
      }

      // Allow headless browsers to capture renderer responses
      if (window.cosmosRendererResponse) {
        window.cosmosRendererResponse(rendererResponse);
      }
    },

    onMessage(onMessage) {
      function handleMessage(msg: MessageEvent<string>) {
        const socketMessage = JSON.parse(msg.data) as SocketMessage;
        if (socketMessage.channel === 'renderer') {
          onMessage(socketMessage.message as RendererRequest);
        }
      }
      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    },
  };
}
