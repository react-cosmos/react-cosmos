import { mapValues } from 'lodash-es';
import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { FixtureId } from '../../../fixture/types.js';
import {
  ByPath,
  ReactDecorator,
  ReactFixtureWrapper,
} from '../../reactTypes.js';
import { RendererConnect, RendererId, RendererResponse } from '../../types.js';
import { FixtureConnect } from '../FixtureConnect.js';
import {
  createRendererConnectTestApi,
  RendererConnectTestApi,
} from './createRendererConnectTestApi.js';
import { createTestRendererConnect } from './createTestRendererConnect.js';

export type RendererTestArgs = {
  rendererId: RendererId;
  fixtures: ByPath<ReactFixtureWrapper>;
  selectedFixtureId?: null | FixtureId;
  initialFixtureId?: FixtureId;
  decorators?: ByPath<ReactDecorator>;
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
  const { fixtures, decorators = {}, ...otherArgs } = args;
  const decoratorsWrappers = mapValues(decorators, decorator => {
    return { module: { default: decorator } };
  });
  return (
    <FixtureConnect
      rendererConnect={rendererConnect}
      moduleWrappers={{
        lazy: false,
        fixtures,
        decorators: decoratorsWrappers,
      }}
      systemDecorators={[]}
      {...otherArgs}
    />
  );
}
