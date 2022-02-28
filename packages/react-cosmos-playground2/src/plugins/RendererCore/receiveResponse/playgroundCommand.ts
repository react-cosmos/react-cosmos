import { PlaygroundCommandResponse } from 'react-cosmos-shared2/renderer';
import { CoreSpec } from 'react-cosmos-shared2/ui';
import { RendererCoreContext } from '../shared';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
