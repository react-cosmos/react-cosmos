import { act, render, RenderResult } from '@testing-library/react';
import { mapValues } from 'lodash-es';
import { setTimeout } from 'node:timers/promises';
import React from 'react';
import {
  ByPath,
  FixtureId,
  ReactDecoratorModule,
  ReactFixtureModule,
  RendererConnect,
  RendererId,
  RendererResponse,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { ClientFixtureLoader } from '../fixtureLoaders/ClientFixtureLoader.js';
import { StatefulRendererProvider } from '../rendererConnect/StatefulRendererProvider.js';
import {
  createRendererConnectTestApi,
  RendererConnectTestApi,
} from './createRendererConnectTestApi.js';
import { createTestRendererConnect } from './createTestRendererConnect.js';

export type RendererTestArgs = {
  rendererId: RendererId;
  locked?: boolean;
  selectedFixtureId?: FixtureId;
  reloadRenderer?: () => void;
  fixtures: ByPath<ReactFixtureModule>;
  decorators?: ByPath<ReactDecoratorModule>;
  lazy?: boolean;
  only?: boolean;
  skip?: boolean;
};

type RendererTestApi = RendererConnectTestApi & {
  renderer: RenderResult;
  rootText: () => string | null;
  update: (args: RendererTestArgs) => Promise<void>;
};

export type RendererTestCallback = (api: RendererTestApi) => Promise<void>;

export async function mountTestRenderer(
  args: RendererTestArgs,
  cb: RendererTestCallback
) {
  expect.hasAssertions();

  let responses: RendererResponse[] = [];
  const { rendererConnect, postRendererRequest } = createTestRendererConnect({
    onRendererResponse(response) {
      responses.push(response);
    },
  });

  const renderer = render(getElement(rendererConnect, args));
  try {
    await cb({
      renderer,
      rootText: () => renderer.container.textContent,
      update: async newArgs => {
        renderer.rerender(getElement(rendererConnect, newArgs));
      },
      ...createRendererConnectTestApi({
        getResponses: () => responses,
        postRequest: postRendererRequest,
        clearResponses: () => {
          responses = [];
        },
      }),
    });
  } finally {
    renderer.unmount();
  }
}

function getElement(rendererConnect: RendererConnect, args: RendererTestArgs) {
  const {
    rendererId,
    locked = false,
    selectedFixtureId = null,
    reloadRenderer = () => {},
    fixtures,
    decorators = {},
    lazy = false,
  } = args;

  return (
    <StatefulRendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={locked}
      selectedFixtureId={selectedFixtureId}
      reloadRenderer={reloadRenderer}
    >
      <ClientFixtureLoader
        moduleWrappers={createModuleWrappers(fixtures, decorators, lazy)}
      />
    </StatefulRendererProvider>
  );
}

function createModuleWrappers(
  fixtures: ByPath<ReactFixtureModule>,
  decorators: ByPath<ReactDecoratorModule>,
  lazy: boolean
): UserModuleWrappers {
  if (lazy) {
    return {
      lazy: true,
      fixtures: mapValues(fixtures, fixture => ({
        getModule: () => dynamicImportWrapper(fixture),
      })),
      decorators: mapValues(decorators, decorator => ({
        getModule: () => dynamicImportWrapper(decorator),
      })),
    };
  } else {
    return {
      lazy: false,
      fixtures: mapValues(fixtures, fixture => ({ module: fixture })),
      decorators: mapValues(decorators, decorator => ({ module: decorator })),
    };
  }
}

function dynamicImportWrapper<T>(module: T) {
  return new Promise<T>(async resolve => {
    // Simulate module download time
    await setTimeout(25 + Math.round(Math.random() * 25));
    await act(async () => {
      resolve(module);
    });
  });
}
