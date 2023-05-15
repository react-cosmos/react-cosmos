import React from 'react';
import {
  RendererConfig,
  RendererSearchParams,
  UserModuleWrappers,
  decodeRendererSearchParams,
} from 'react-cosmos-core';
import { ServerFixtureLoader } from 'react-cosmos-renderer';
import { NextRendererProvider } from './NextRendererProvider.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  searchParams: RendererSearchParams;
};
export function NextFixtureLoader({
  rendererConfig,
  moduleWrappers,
  searchParams,
}: Props) {
  const { locked = false, fixtureId = null } = React.useMemo(
    () => decodeRendererSearchParams(searchParams),
    [searchParams]
  );

  const selectedFixture = fixtureId && {
    fixtureId,
    initialFixtureState: {},
    // This fixture loader is meant to work with Next.js build-time static
    // generation. Its props will be driven by finite URL segment params and not
    // query strings, which are inherently dynamic. This means we can't receive
    // an incrementing renderKey here. Instead, we'll rely solely on the fixture
    // ID as the fixture render key and will not support refreshing the current
    // fixture by selecting it again.
    renderKey: 0,
  };

  return (
    <NextRendererProvider
      rendererConfig={rendererConfig}
      locked={locked}
      selectedFixture={selectedFixture}
    >
      <ServerFixtureLoader
        moduleWrappers={moduleWrappers}
        renderMessage={renderMessage}
        selectedFixture={selectedFixture}
      />
    </NextRendererProvider>
  );
}

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

function renderMessage(msg: string) {
  return <div style={containerStyle}>{msg}</div>;
}
