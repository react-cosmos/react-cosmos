import { TurboModuleRegistry } from 'react-native';

export function getSocketUrl(playgroundUrl: string) {
  // The URL module isn't implemented fully in React Native and I don't want to
  // bring in another dependency just for this.
  const sourceCode = TurboModuleRegistry.getEnforcing('SourceCode');
  const constants = sourceCode.getConstants?.() as any;
  const scriptURL = constants.scriptURL as string;

  // https://stackoverflow.com/a/27755/1332513
  const urlRegex = /^(.*:)\/\/([A-Za-z0-9\-\.]+)(:[0-9]+)?(.*)$/;
  const [, _protocol, host] = scriptURL.match(urlRegex) || [];

  const [_url, protocol, _host, port = ':80'] =
    playgroundUrl.match(urlRegex) || [];
  const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';

  return `${wsProtocol}://${host}${port}`;
}
