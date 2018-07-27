// @flow

export type Device = {|
  label: string,
  width: number,
  height: number
|};

export type Devices = Array<Device>;

export type PluginConfig = {
  devices: Devices
};

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
