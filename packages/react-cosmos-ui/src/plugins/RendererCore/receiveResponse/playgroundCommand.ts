import { PlaygroundCommandResponse } from 'react-cosmos-core';
import { CoreSpec } from '../../Core/spec.js';
import { RendererCoreContext } from '../shared/index.js';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
