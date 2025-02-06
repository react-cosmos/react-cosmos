import React from 'react';
import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';
import { NextFixtureLoader } from './NextFixtureLoader.js';
import { NextCosmosParams } from './nextTypes.js';

export function nextCosmosPage(args: {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
}) {
  return async function NextCosmosPage(props: {
    params: Promise<NextCosmosParams>;
  }) {
    return (
      <NextFixtureLoader
        rendererConfig={args.rendererConfig}
        moduleWrappers={args.moduleWrappers}
        params={await props.params}
      />
    );
  };
}
