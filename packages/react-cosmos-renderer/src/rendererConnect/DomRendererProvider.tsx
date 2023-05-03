import React from 'react';
import { RendererContext } from './RendererContext.js';
import { createDomRendererConnect } from './domRendererConnect.js';
import { getDomRendererId } from './domRendererId.js';

type Props = {
  children: React.ReactNode;
  playgroundUrl: string;
};
export function DomRendererProvider({ children, playgroundUrl }: Props) {
  const value = React.useMemo(() => {
    return {
      rendererId: getDomRendererId(),
      rendererConnect: createDomRendererConnect(playgroundUrl),
    };
  }, [playgroundUrl]);

  return (
    <RendererContext.Provider value={value}>
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </RendererContext.Provider>
  );
}

function GlobalErrorHandler() {
  const { rendererId, rendererConnect } = React.useContext(RendererContext);

  React.useEffect(() => {
    function handleGlobalError() {
      rendererConnect.postMessage({
        type: 'rendererError',
        payload: { rendererId },
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
  }, [rendererConnect, rendererId]);

  return null;
}
