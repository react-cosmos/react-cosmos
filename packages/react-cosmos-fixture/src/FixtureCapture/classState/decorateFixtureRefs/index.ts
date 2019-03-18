import * as React from 'react';
import { setElementAtPath } from '../../shared/nodeTree';
import { findRelevantElementPaths } from '../../shared/findRelevantElementPaths';
import { CachedRefHandlers } from '../shared';
import { isRefSupported } from './isRefSupported';

type ElementWithRef = React.ReactElement & {
  ref: null | React.Ref<any>;
};

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
          (element as ElementWithRef).ref,
          spyRef,
          elPath,
          cachedRefHandlers
        )
      });
    });
  }, fixture);
}

function getDecoratedRef(
  origRef: null | React.Ref<any>,
  spyRef: SpyRef,
  elPath: string,
  cachedRefHandlers: CachedRefHandlers
) {
  const found = cachedRefHandlers[elPath];
  if (found && found.origRef === origRef) {
    return found.handler;
  }

  const handler = decorateRefWithSpy(origRef, spyRef, elPath);
  cachedRefHandlers[elPath] = { origRef, handler };

  return handler;
}

function decorateRefWithSpy(
  origRef: null | React.Ref<any>,
  spyRef: SpyRef,
  elPath: string
) {
  return (elRef: null | React.Component) => {
    if (origRef) {
      callOriginalRef(origRef, elRef);
    }
    spyRef(elPath, elRef);
  };
}

function callOriginalRef(ref: React.Ref<any>, elRef: null | React.Component) {
  if (typeof ref === 'string') {
    console.warn('[createRefAdaptor] String refs are not supported');
    return;
  }

  if (typeof ref === 'function') {
    ref(elRef);
    return;
  }

  const refObj = ref as React.MutableRefObject<any>;
  refObj.current = elRef;
}
