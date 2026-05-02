import type { PlaygroundCommandResponse } from 'react-cosmos-core';
import type { CoreSpec } from '../../Core/spec.js';
import type { RendererCoreContext } from '../shared/index.js';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
