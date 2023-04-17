import React, { useEffect, useMemo } from 'react';
import { FixtureConnect, UserModuleWrappers } from 'react-cosmos-core';
import { createDomRendererConnect } from './domRendererConnect.js';
import { domRendererId } from './domRendererId.js';
import { ErrorCatch } from './ErrorCatch.js';
import { selectedFixtureId } from './selectedFixtureId.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  playgroundUrl: string;
  onErrorReset?: () => unknown;
};
export function DomFixtureLoader(props: Props) {
  const { moduleWrappers, playgroundUrl, onErrorReset } = props;

  const domRendererConnect = useMemo(
    () => createDomRendererConnect(playgroundUrl),
    [playgroundUrl]
  );

  useEffect(() => {
    function handleGlobalError() {
      domRendererConnect.postMessage({
        type: 'rendererError',
        payload: { rendererId: domRendererId },
      });
    }
    // Unhandled errors from async code will not be caught by the error event, but
    // the unhandledrejection event instead.
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [domRendererConnect]);

  return (
    <FixtureConnect
      rendererId={domRendererId}
      rendererConnect={domRendererConnect}
      moduleWrappers={moduleWrappers}
      systemDecorators={systemDecorators}
      selectedFixtureId={selectedFixtureId}
      renderMessage={renderDomMessage}
      onErrorReset={onErrorReset}
    />
  );
}

const systemDecorators = [ErrorCatch];

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", Helvetica, sans-serif',
  fontSize: 14,
};

export function renderDomMessage(msg: string) {
  return <div style={containerStyle}>{msg}</div>;
}
