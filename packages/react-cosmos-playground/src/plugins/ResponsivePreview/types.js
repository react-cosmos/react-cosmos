// @flow

export type Viewport = { width: number, height: number };

export type PluginState =
  | {
      enabled: true,
      viewport: Viewport
    }
  | {
      enabled: false,
      viewport?: Viewport
    };
