import React from 'react';
import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';
import { NextFixtureLoader } from './NextFixtureLoader.js';
import { NextCosmosParams } from './nextTypes.js';

type Args = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
};
export function nextCosmosPage({ rendererConfig, moduleWrappers }: Args) {
  return function NextCosmosPage({ params }: { params: NextCosmosParams }) {
    return (
      <NextFixtureLoader
        rendererConfig={rendererConfig}
        moduleWrappers={moduleWrappers}
        params={params}
      />
    );
  };
}
