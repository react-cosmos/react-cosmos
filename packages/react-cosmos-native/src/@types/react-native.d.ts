// Ambient stub for the react-native API surface used in this package.
// react-native is a peer dependency that no longer ships standalone types
// (@types/react-native is deprecated), and installing it drags in ~200MB of
// toolchain (Metro, Hermes, Babel 7) just to type-check this package. Only
// the APIs used here are declared. Consumers get real types from their own
// react-native install.
declare module 'react-native' {
  import type * as React from 'react';

  export type Style = { [key: string]: string | number };

  export type StyleProp =
    | Style
    | readonly StyleProp[]
    | null
    | undefined
    | false;

  export const View: React.ComponentType<{
    style?: StyleProp;
    children?: React.ReactNode;
  }>;

  export const Text: React.ComponentType<{
    style?: StyleProp;
    children?: React.ReactNode;
  }>;

  export const StyleSheet: {
    create<T extends Record<string, Style>>(styles: T): T;
  };

  export const DevSettings: {
    reload(reason?: string): void;
  };
}
