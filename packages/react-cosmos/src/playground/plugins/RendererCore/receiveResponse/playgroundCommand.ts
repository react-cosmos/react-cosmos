import { PlaygroundCommandResponse } from '../../../../renderer/types';
import { CoreSpec } from '../../../../ui/specs/CoreSpec';
import { RendererCoreContext } from '../shared';

export function receivePlaygroundCommandResponse(
  context: RendererCoreContext,
  { payload }: PlaygroundCommandResponse
) {
  const { command } = payload;
  const core = context.getMethodsOf<CoreSpec>('core');
  core.runCommand(command);
}
