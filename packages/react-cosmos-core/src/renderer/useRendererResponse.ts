import { useEffect, useRef } from 'react';
import { FixtureId } from '../fixture/types.js';
import { getFixtureListFromWrappers } from './getFixtureList.js';
import { RendererConnect } from './rendererConnectTypes.js';
import { UserModuleWrappers } from './userModuleTypes.js';

export function useRendererResponse(
  rendererId: string,
  rendererConnect: RendererConnect,
  moduleWrappers: UserModuleWrappers,
  initialFixtureId?: FixtureId
) {
  const readyRef = useRef(false);

  useEffect(() => {
    const fixtures = getFixtureListFromWrappers(moduleWrappers);

    if (readyRef.current) {
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    } else {
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
      readyRef.current = true;
    }
  }, [initialFixtureId, moduleWrappers, rendererConnect, rendererId]);
}
