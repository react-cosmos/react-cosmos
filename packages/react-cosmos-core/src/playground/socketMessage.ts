export type MessageType = {
  type: string;
  payload?: {};
};

export type SocketMessage = {
  eventName: 'renderer' | 'server';
  body: MessageType;
};
