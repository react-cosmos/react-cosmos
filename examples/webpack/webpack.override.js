export default function (webpackConfig, env) {
  // Customize webpack config for Cosmos...
  console.log('Overriding webpack config for Cosmos!');
  console.log('Environment:', env);
  return webpackConfig;
}
