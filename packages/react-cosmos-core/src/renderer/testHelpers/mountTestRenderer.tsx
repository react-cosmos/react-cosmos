import delay from 'delay';
import { mapValues } from 'lodash-es';
import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { FixtureId } from '../../fixture/types.js';
import { FixtureConnect } from '../FixtureConnect.js';
import {
  ByPath,
  ReactDecorator,
  ReactFixtureExport,
  UserModuleWrappers,
} from '../reactTypes.js';
import {
  RendererConnect,
  RendererId,
  RendererResponse,
} from '../rendererConnectTypes.js';
import {
  createRendererConnectTestApi,
  RendererConnectTestApi,
} from './createRendererConnectTestApi.js';
import { createTestRendererConnect } from './createTestRendererConnect.js';

export type RendererTestArgs = {
  rendererId: RendererId;
  fixtures: ByPath<ReactFixtureExport>;
  selectedFixtureId?: null | FixtureId;
  initialFixtureId?: FixtureId;
  decorators?: ByPath<ReactDecorator>;
  lazy?: boolean;
  only?: boolean;
  onErrorReset?: () => unknown;
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
      }),
    });
  } finally {
    renderer.unmount();
  }
}

function getElement(rendererConnect: RendererConnect, args: RendererTestArgs) {
  const { fixtures, decorators = {}, lazy = false, ...otherArgs } = args;
  return (
    <FixtureConnect
      rendererConnect={rendererConnect}
      moduleWrappers={getModuleWrappers(fixtures, decorators, lazy)}
      systemDecorators={[]}
      {...otherArgs}
    />
  );
}

function getModuleWrappers(
  fixtures: ByPath<ReactFixtureExport>,
  decorators: ByPath<ReactDecorator>,
  lazy: boolean
): UserModuleWrappers {
  if (lazy) {
    return {
      lazy: true,
      fixtures: mapValues(fixtures, fixture => ({
        getModule: () => dynamicImportWrapper({ default: fixture }),
      })),
      decorators: mapValues(decorators, decorator => ({
        getModule: () => dynamicImportWrapper({ default: decorator }),
      })),
    };
  } else {
    return {
      lazy: false,
      fixtures: mapValues(fixtures, fixture => ({
        module: { default: fixture },
      })),
      decorators: mapValues(decorators, decorator => ({
        module: { default: decorator },
      })),
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
