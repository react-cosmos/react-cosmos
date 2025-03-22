export type RendererConfig = {
  playgroundUrl: string;
  // TODO: Should serverAddress contain the WebSocket protocol? Or should it be
  // called wsServerAddress?
  serverAddress: string | null;
  rendererUrl: string | null;
};
