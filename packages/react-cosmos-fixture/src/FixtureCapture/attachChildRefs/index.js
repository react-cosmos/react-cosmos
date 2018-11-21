// @flow

import { cloneElement, Component } from 'react';
import { setElementAtPath } from '../childrenTree';
import { findRelevantElementPaths } from '../findRelevantElementPaths';
import { compose } from './compose';
import { isRefSupported } from './isRefSupported';
import { createRefHandler } from './createRefHandler';

import type { ElementRef, Ref } from 'react';
import type { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import type { Children } from '../childrenTree';
import type { ComponentRef } from '../shared';

type RefWrapper = {
  origRef: ?Ref<any>,
  handler: (elRef: ?ComponentRef) => mixed
};

type RefWrappers = {
  [elPath: string]: RefWrapper
};

// Ref handlers are reused because every time we pass a new ref handler to
// a React element it gets called in the next render loop, even when the
// associated element instance has been preserved. Having ref handlers fire
// on every render loop results in unwanted operations and race conditions.
const refHandlers: WeakMap<
  ElementRef<typeof Component>,
  RefWrappers
> = new WeakMap();

export function attachChildRefs({
  children,
  onRef,
  decoratorElRef,
  decoratorId
}: {
  children: Children,
  onRef: (elPath: string, elRef: ?ComponentRef) => mixed,
  decoratorElRef: ElementRef<typeof Component>,
  decoratorId: FixtureDecoratorId
}) {
  const elPaths = findRelevantElementPaths(children);

  return elPaths.reduce((extendedChildren, elPath): Children => {
    return setElementAtPath(extendedChildren, elPath, element => {
      if (!isRefSupported(element.type)) {
        return element;
      }

      return cloneElement(element, {
        ref: getWrappedRefHandler({
          origRef: element.ref,
          onRef,
          decoratorElRef,
          decoratorId,
          elPath
        })
      });
    });
  }, children);
}

export function deleteRefHandler(
  decoratorElRef: ElementRef<typeof Component>,
  decoratorId: FixtureDecoratorId,
  elPath: string
) {
  const handlers = refHandlers.get(decoratorElRef);
  if (handlers) {
    delete handlers[getHandlerPath({ decoratorId, elPath })];
  }
}

export function deleteRefHandlers(
  decoratorElRef: ElementRef<typeof Component>
) {
  delete refHandlers.delete(decoratorElRef);
}

function getWrappedRefHandler({
  origRef,
  onRef,
  decoratorElRef,
  decoratorId,
  elPath
}) {
  const handlers = refHandlers.get(decoratorElRef) || {};
  const handlerPath = getHandlerPath({ decoratorId, elPath });
  const found = handlers[handlerPath];

  if (found && found.origRef === origRef) {
    return found.handler;
  }

  const rootHandler = elRef => onRef(elPath, elRef);
  const handler = origRef
    ? compose(
        rootHandler,
        createRefHandler(origRef)
      )
    : rootHandler;

  refHandlers.set(decoratorElRef, {
    ...handlers,
    [handlerPath]: { origRef, handler }
  });

  return handler;
}

function getHandlerPath({ decoratorId, elPath }) {
  return `${decoratorId}-${elPath}`;
}
