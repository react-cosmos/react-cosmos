import { PlaygroundCommandResponse } from 'react-cosmos-core';
import { CoreSpec } from '../../Core/spec';
import { RendererCoreContext } from '../shared';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
