export type RendererConfig = {
  // TODO: Should serverAddress contain the WebSocket protocol? Or should it be
  // called wsServerAddress? or wsAddress? or wsUrl? or webSocketUrl?
  serverAddress: string | null;
  rendererUrl: string | null;
};
