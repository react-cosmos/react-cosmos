export type MessageType = {
  type: string;
  payload?: {};
};

export type SocketMessage = {
  eventName: 'renderer' | 'server';
  body: MessageType;
};

export function serverSocketMessage(body: MessageType): SocketMessage {
  return { eventName: 'server', body };
}

export function rendererSocketMessage(body: MessageType): SocketMessage {
  return { eventName: 'renderer', body };
}
