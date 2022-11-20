import { requireFromSilent } from 'react-cosmos/server.js';
import webpack from 'webpack';

export function getWebpack(rootDir: string) {
  const userWebpack = requireFromSilent(rootDir, 'webpack') as typeof webpack;
  if (!userWebpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log(
      'Install using "yarn add --dev webpack" or "npm install --save-dev webpack"'
    );
    return;
  }

  return userWebpack;
}
