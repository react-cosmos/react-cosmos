import { useEffect, useRef } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { getFixtureListFromLazyWrappers } from '../getFixtureList.js';
import { LazyReactFixtureWrappersByPath } from '../reactTypes.js';
import { RendererConnect } from '../types.js';

export function useRendererResponse(
  rendererId: string,
  rendererConnect: RendererConnect,
  fixtureWrappersByPath: LazyReactFixtureWrappersByPath,
  initialFixtureId?: FixtureId
) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      const fixtures = getFixtureListFromLazyWrappers(fixtureWrappersByPath);
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
    }
  }, [fixtureWrappersByPath, initialFixtureId, rendererConnect, rendererId]);

  useEffect(() => {
    if (mountedRef.current) {
      const fixtures = getFixtureListFromLazyWrappers(fixtureWrappersByPath);
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    }
  }, [fixtureWrappersByPath, rendererConnect, rendererId]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);
}
