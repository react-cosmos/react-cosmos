import webpack from 'webpack';
import { requireFromSilent } from './utils/requireSilent.js';

export function getWebpack(rootDir: string) {
  const userWebpack = requireFromSilent(rootDir, 'webpack') as typeof webpack;
  if (!userWebpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log(
      'Install using "npm install --save-dev webpack" or "yarn add --dev webpack"'
    );
    return;
  }

  return userWebpack;
}
