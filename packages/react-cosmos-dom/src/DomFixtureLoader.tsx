import React, { useEffect, useMemo } from 'react';
import { FixtureConnect, UserModuleWrappers } from 'react-cosmos-core';
import { ErrorCatch } from './ErrorCatch.js';
import { createDomRendererConnect } from './domRendererConnect.js';
import { getRendererId } from './domRendererId.js';
import { getSelectedFixtureId } from './selectedFixtureId.js';
import { isInsideCosmosPreviewIframe } from './utils/isInsideCosmosPreviewIframe.js';

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
        payload: { rendererId: getRendererId() },
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
      rendererId={getRendererId()}
      rendererConnect={domRendererConnect}
      moduleWrappers={moduleWrappers}
      systemDecorators={systemDecorators}
      selectedFixtureId={getSelectedFixtureId()}
      renderMessage={renderDomMessage}
      renderNoFixtureSelected={!isInsideCosmosPreviewIframe()}
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
