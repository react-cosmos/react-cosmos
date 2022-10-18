import importFrom from 'import-from';
import webpack from 'webpack';

export function getWebpack(rootDir: string) {
  const userWebpack = importFrom.silent(rootDir, 'webpack') as typeof webpack;
  if (!userWebpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log(
      'Install using "yarn add --dev webpack" or "npm install --save-dev webpack"'
    );
    return;
  }

  return userWebpack;
}
