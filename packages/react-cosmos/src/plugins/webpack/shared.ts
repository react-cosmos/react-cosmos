import importFrom from 'import-from';
import webpack from 'webpack';

export function getWebpack(rootDir: string) {
  const userWebpack = importFrom.silent<typeof webpack>(rootDir, 'webpack');
  if (!userWebpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  return userWebpack;
}
