import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { setElementAtPath } from '../nodeTree';
import { findRelevantElementPaths } from '../findRelevantElementPaths';
import { compose } from './compose';
import { isRefSupported } from './isRefSupported';
import { createRefHandler } from './createRefHandler';

interface IElementWithRef extends React.ReactElement {
  ref: null | React.Ref<any>;
}

type RefWrapper = {
  origRef: null | React.Ref<any>;
  handler: (elRef: null | React.Component) => unknown;
};

type RefWrappers = {
  [elPath: string]: RefWrapper;
};

type OnRef = (elPath: string, elRef: null | React.Component) => unknown;

// Ref handlers are reused because every time we pass a new ref handler to
// a React element it gets called in the next render loop, even when the
// associated element instance has been preserved. Having ref handlers fire
// on every render loop results in unwanted operations and race conditions.
const refHandlers: WeakMap<React.Component, RefWrappers> = new WeakMap();

export function attachChildRefs({
  node,
  onRef,
  decoratorElRef,
  decoratorId
}: {
  node: React.ReactNode;
  onRef: OnRef;
  decoratorElRef: React.Component;
  decoratorId: FixtureDecoratorId;
}) {
  const elPaths = findRelevantElementPaths(node);

  return elPaths.reduce((extendedNode, elPath): React.ReactNode => {
    return setElementAtPath(extendedNode, elPath, element => {
      if (!isRefSupported(element.type)) {
        return element;
      }

      return React.cloneElement(element, {
        ref: getWrappedRefHandler({
          origRef: (element as IElementWithRef).ref,
          onRef,
          decoratorElRef,
          decoratorId,
          elPath
        })
      });
    });
  }, node);
}

export function deleteRefHandler(
  decoratorElRef: React.Component,
  decoratorId: FixtureDecoratorId,
  elPath: string
) {
  const handlers = refHandlers.get(decoratorElRef);
  if (handlers) {
    delete handlers[getHandlerPath({ decoratorId, elPath })];
  }
}

export function deleteRefHandlers(decoratorElRef: React.Component) {
  refHandlers.delete(decoratorElRef);
}

function getWrappedRefHandler({
  origRef,
  onRef,
  decoratorElRef,
  decoratorId,
  elPath
}: {
  origRef: null | React.Ref<any>;
  onRef: OnRef;
  decoratorElRef: React.Component;
  decoratorId: FixtureDecoratorId;
  elPath: string;
}) {
  const handlers = refHandlers.get(decoratorElRef) || {};
  const handlerPath = getHandlerPath({ decoratorId, elPath });
  const found = handlers[handlerPath];

  if (found && found.origRef === origRef) {
    return found.handler;
  }

  const rootHandler = (elRef: null | React.Component) => onRef(elPath, elRef);
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

function getHandlerPath({
  decoratorId,
  elPath
}: {
  decoratorId: FixtureDecoratorId;
  elPath: string;
}) {
  return `${decoratorId}-${elPath}`;
}
