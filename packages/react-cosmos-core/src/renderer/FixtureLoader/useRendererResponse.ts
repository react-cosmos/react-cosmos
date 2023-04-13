import { useEffect, useRef } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { getFixtureListFromWrappers } from '../getFixtureList.js';
import { UserModuleWrappers } from '../reactTypes.js';
import { RendererConnect } from '../types.js';

export function useRendererResponse(
  rendererId: string,
  rendererConnect: RendererConnect,
  moduleWrappers: UserModuleWrappers,
  initialFixtureId?: FixtureId
) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      const fixtures = getFixtureListFromWrappers(moduleWrappers);
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
    }
  }, [initialFixtureId, moduleWrappers, rendererConnect, rendererId]);

  useEffect(() => {
    if (mountedRef.current) {
      const fixtures = getFixtureListFromWrappers(moduleWrappers);
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    }
  }, [moduleWrappers, rendererConnect, rendererId]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
}
