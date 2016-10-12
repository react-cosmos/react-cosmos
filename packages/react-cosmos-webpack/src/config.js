export default function getConfig(userConfig) {
  // The user config is not read in here because this function is used on both
  // the server and client side and reading it is different per case.
  // On the server side we read the path from the webpack CLI params while on
  // the client receives the embedded path through webpack.DefinePlugin.
  // These function just applies the defaults, which are "universal".
  return {
    globalImports: [],
    hostname: 'localhost',
    hot: false,
    ignore: [],
    port: 8989,
    proxies: [],
    ...userConfig,
  };
}
