import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { setElementAtPath } from '../../shared/nodeTree';
import { findRelevantElementPaths } from '../../shared/findRelevantElementPaths';
import { compose } from './compose';
import { isRefSupported } from './isRefSupported';
import { createRefHandler } from './createRefHandler';

type ElementWithRef = React.ReactElement & {
  ref: null | React.Ref<any>;
};

type OnRef = (elPath: string, elRef: null | React.Component) => unknown;

type RefWrapper = {
  origRef: null | React.Ref<any>;
  handler: (elRef: null | React.Component) => unknown;
};

type RefWrappers = {
  [elPath: string]: RefWrapper;
};

// Ref handlers are reused because every time we pass a new ref handler to
// a React element it gets called in the next render loop, even when the
// associated element instance has been preserved. Having ref handlers fire
// on every render loop results in unwanted operations and race conditions.
const refHandlers: WeakMap<object, RefWrappers> = new WeakMap();

// TODO: Receive RefWrappers as arg
export function attachChildRefs({
  node,
  onRef,
  decoratorRef,
  decoratorId
}: {
  node: React.ReactNode;
  onRef: OnRef;
  decoratorRef: {};
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
          origRef: (element as ElementWithRef).ref,
          onRef,
          decoratorRef,
          decoratorId,
          elPath
        })
      });
    });
  }, node);
}

export function deleteRefHandler(
  decoratorRef: object,
  decoratorId: FixtureDecoratorId,
  elPath: string
) {
  const handlers = refHandlers.get(decoratorRef);
  if (handlers) {
    delete handlers[getHandlerPath({ decoratorId, elPath })];
  }
}

// export function deleteRefHandlers(decoratorElRef: React.Component) {
//   refHandlers.delete(decoratorElRef);
// }

function getWrappedRefHandler({
  origRef,
  onRef,
  decoratorRef,
  decoratorId,
  elPath
}: {
  origRef: null | React.Ref<any>;
  onRef: OnRef;
  decoratorRef: object;
  decoratorId: FixtureDecoratorId;
  elPath: string;
}) {
  const handlers = refHandlers.get(decoratorRef) || {};
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

  refHandlers.set(decoratorRef, {
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
