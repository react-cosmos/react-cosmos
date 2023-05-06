import delay from 'delay';
import { mapValues } from 'lodash-es';
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
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import { ClientFixtureLoader } from '../fixtureLoaders/ClientFixtureLoader.js';
import {
  RendererContext,
  RendererContextValue,
} from '../rendererConnect/RendererContext.js';
import {
  RendererConnectTestApi,
  createRendererConnectTestApi,
} from './createRendererConnectTestApi.js';
import { createTestRendererConnect } from './createTestRendererConnect.js';

export type RendererTestArgs = {
  rendererId: RendererId;
  // TODO: Test these
  lockedFixture?: boolean;
  reloadRenderer?: (fixtureId: FixtureId | null) => void;
  fixtures: ByPath<ReactFixtureModule>;
  selectedFixtureId?: null | FixtureId;
  initialFixtureId?: FixtureId;
  decorators?: ByPath<ReactDecoratorModule>;
  lazy?: boolean;
  only?: boolean;
};

type RendererTestApi = RendererConnectTestApi & {
  renderer: ReactTestRenderer;
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

  // This act() call ensures the component is subscribed to renderer requests
  // before the test is executed.
  let renderer = undefined as any as ReactTestRenderer;
  act(() => {
    renderer = create(getElement(rendererConnect, args));
  });
  try {
    await cb({
      renderer,
      update: async newArgs => {
        act(() => {
          renderer.update(getElement(rendererConnect, newArgs));
        });
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
    lockedFixture = false,
    reloadRenderer = () => {},
    fixtures,
    decorators = {},
    lazy = false,
  } = args;
  const contextValue: RendererContextValue = {
    rendererConfig: {
      playgroundUrl: 'http://localhost:5000',
      reloadOnFixtureChange: false,
    },
    rendererId,
    rendererConnect,
    lockedFixture,
    reloadRenderer,
  };
  return (
    <RendererContext.Provider value={contextValue}>
      <ClientFixtureLoader
        moduleWrappers={getModuleWrappers(fixtures, decorators, lazy)}
        initialFixtureId={args.initialFixtureId}
        selectedFixtureId={args.selectedFixtureId}
      />
    </RendererContext.Provider>
  );
}

function getModuleWrappers(
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
    await delay(Math.round(Math.random() * 50));
    await act(() => {
      resolve(module);
    });
  });
}
