import { useEffect, useRef } from 'react';
import { FixtureId } from '../shared/fixtureTypes.js';
import { getFixtureListFromWrappers } from '../shared/getFixtureList.js';
import { RendererConnect } from '../shared/rendererConnectTypes.js';
import { UserModuleWrappers } from '../shared/userModuleTypes.js';

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
