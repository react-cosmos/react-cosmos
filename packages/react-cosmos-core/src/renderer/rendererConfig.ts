export type RendererConfig = {
  playgroundUrl: string;
};

export type CustomRendererConfig = RendererConfig & {
  rendererUrl: null | string | { dev: string; export: string };
};
