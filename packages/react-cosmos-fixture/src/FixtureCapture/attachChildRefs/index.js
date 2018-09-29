// @flow

import { cloneElement } from 'react';
import { setElementAtPath } from '../childrenTree';
import { findRelevantElementPaths } from '../findRelevantElementPaths';
import { compose } from './compose';
import { isRefSupported } from './isRefSupported';
import { createRefHandler } from './createRefHandler';

import type { Ref } from 'react';
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
const refHandlers: {
  [FixtureDecoratorId]: RefWrappers
} = {};

export function attachChildRefs(
  children: Children,
  onRef: (elPath: string, elRef: ?ComponentRef) => mixed,
  decoratorId: FixtureDecoratorId
) {
  const elPaths = findRelevantElementPaths(children);

  return elPaths.reduce((extendedChildren, elPath): Children => {
    return setElementAtPath(extendedChildren, elPath, element => {
      if (!isRefSupported(element.type)) {
        return element;
      }

      return cloneElement(element, {
        ref: getWrappedRefHandler({
          elPath,
          origRef: element.ref,
          onRef,
          decoratorId
        })
      });
    });
  }, children);
}

export function deleteRefHandler(
  decoratorId: FixtureDecoratorId,
  elPath: string
) {
  delete refHandlers[decoratorId][elPath];
}

export function deleteRefHandlers(decoratorId: FixtureDecoratorId) {
  delete refHandlers[decoratorId];
}

function getWrappedRefHandler({ elPath, origRef, onRef, decoratorId }) {
  const handlers = refHandlers[decoratorId] || {};
  const found = handlers[elPath];

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

  refHandlers[decoratorId] = {
    ...refHandlers[decoratorId],
    [elPath]: { origRef, handler }
  };

  return handler;
}
