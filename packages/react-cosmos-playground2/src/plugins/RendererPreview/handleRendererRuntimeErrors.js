// @flow
/* eslint-env browser */

import type { RendererPreviewContext } from './shared';

export function handleRendererRuntimeErrors({
  setState
}: RendererPreviewContext) {
  // This is a global handler exposed for alien renderer code (from inside the
  // preview iframe) to call when it captures an unhandled exception
  window.onRendererRuntimeError = () => {
    setState(state => ({ ...state, runtimeError: true }));
  };

  return () => {
    delete window.onRendererRuntimeError;
  };
}

export function resetErrorState({ setState }: RendererPreviewContext) {
  setState(state => ({ ...state, runtimeError: false }));
}
