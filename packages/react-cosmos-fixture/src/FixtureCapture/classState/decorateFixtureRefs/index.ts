import * as React from 'react';
import { setElementAtPath } from '../../shared/nodeTree';
import { findRelevantElementPaths } from '../../shared/findRelevantElementPaths';
import { CachedRefHandlers } from '../shared';
import { compose } from './compose';
import { isRefSupported } from './isRefSupported';

type ElementWithRef = React.ReactElement & {
  ref: null | React.Ref<any>;
};

type FnRef = (elRef: null | React.Component) => unknown;

type SpyRef = (elPath: string, elRef: null | React.Component) => unknown;

export function decorateFixtureRefs(
  fixture: React.ReactNode,
  spyRef: SpyRef,
  cachedRefHandlers: CachedRefHandlers
) {
  const elPaths = findRelevantElementPaths(fixture);
  return elPaths.reduce((decoratedFixture, elPath): React.ReactNode => {
    return setElementAtPath(decoratedFixture, elPath, element => {
      if (!isRefSupported(element.type)) {
        return element;
      }

      return React.cloneElement(element, {
        ref: getDecoratedRef(
          elPath,
          (element as ElementWithRef).ref,
          spyRef,
          cachedRefHandlers
        )
      });
    });
  }, fixture);
}

function getDecoratedRef(
  elPath: string,
  origRef: null | React.Ref<any>,
  spyRef: SpyRef,
  cachedRefHandlers: CachedRefHandlers
) {
  const found = cachedRefHandlers[elPath];
  if (found && found.origRef === origRef) {
    return found.handler;
  }

  const spyHandler: FnRef = elRef => spyRef(elPath, elRef);
  const handler = origRef
    ? compose(
        spyHandler,
        createRefAdaptor(origRef)
      )
    : spyHandler;

  cachedRefHandlers[elPath] = { origRef, handler };
  return handler;
}

// Create a (composable) handler for both function refs and refs created using
// React.createRef.
export function createRefAdaptor(origRef: React.Ref<any>) {
  if (typeof origRef === 'string') {
    // No need to throw exception, because it would make Cosmos unusable for
    // users of string refs.
    console.warn('[createRefAdaptor] String refs are not supported');
  }

  return (elRef: null | React.Component) => {
    // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    if (typeof origRef === 'function') {
      origRef(elRef);
    } else if (origRef && typeof origRef === 'object') {
      (origRef as React.MutableRefObject<any>).current = elRef;
    }

    // Return element ref to make the ref handler composable
    return elRef;
  };
}
