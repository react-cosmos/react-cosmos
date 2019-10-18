import { PlaygroundCommandResponse } from 'react-cosmos-shared2/renderer';
import { RendererCoreContext } from '../shared';
import { CoreSpec } from '../../Core/public';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
