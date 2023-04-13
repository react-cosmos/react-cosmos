import { useEffect, useRef } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { getFixtureListFromWrappersNew } from '../getFixtureList.js';
import { FixtureWrappers } from '../reactTypes.js';
import { RendererConnect } from '../types.js';

export function useRendererResponse(
  rendererId: string,
  rendererConnect: RendererConnect,
  fixtureWrappers: FixtureWrappers,
  initialFixtureId?: FixtureId
) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      const fixtures = getFixtureListFromWrappersNew(fixtureWrappers);
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
    }
  }, [fixtureWrappers, initialFixtureId, rendererConnect, rendererId]);

  useEffect(() => {
    if (mountedRef.current) {
      const fixtures = getFixtureListFromWrappersNew(fixtureWrappers);
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    }
  }, [fixtureWrappers, rendererConnect, rendererId]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
}
