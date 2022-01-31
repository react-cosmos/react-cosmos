export function getWebpackNodeEnv() {
  // Disallow non dev/prod environments, like "test" inside Jest, because
  // they are not supported by webpack
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}
