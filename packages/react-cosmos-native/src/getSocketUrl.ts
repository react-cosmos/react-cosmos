import * as ReactNative from 'react-native';

const { NativeModules } = ReactNative;

export function getSocketUrl(playgroundUrl: string) {
  // The URL module isn't implemented fully in React Native and I don't want to
  // bring in another dependency just for this.
  const scriptURL = NativeModules.SourceCode.scriptURL as string;
  const [, hostname] = scriptURL.match(/:\/\/(.+?)(:|\/)/)!;

  const portMatch = playgroundUrl.match(/:(\d+)(\/|$)/);
  const port = portMatch ? portMatch[1] : '80';

  return `ws://${hostname}:${port}`;
}
