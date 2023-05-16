import { CosmosCommand } from '../cosmosPlugin/types.js';

export function getRendererUrlForCommand(
  rendererUrl: null | string | { dev: string; export: string },
  command: CosmosCommand
) {
  return rendererUrl && typeof rendererUrl === 'object'
    ? rendererUrl[command]
    : rendererUrl;
}
