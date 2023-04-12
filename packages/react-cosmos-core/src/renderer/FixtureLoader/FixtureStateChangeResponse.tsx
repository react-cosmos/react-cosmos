import React, { ReactNode, useEffect, useRef } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState } from '../../fixtureState/types.js';
import { RendererConnect } from '../types.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  children: ReactNode;
};
export function FixtureStateChangeResponse({
  rendererId,
  rendererConnect,
  fixtureId,
  fixtureState,
  children,
}: Props) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      rendererConnect.postMessage({
        type: 'fixtureStateChange',
        payload: {
          rendererId,
          fixtureId,
          fixtureState,
        },
      });
    }
  }, [fixtureId, fixtureState, rendererConnect, rendererId]);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  return <>{children}</>;
}
