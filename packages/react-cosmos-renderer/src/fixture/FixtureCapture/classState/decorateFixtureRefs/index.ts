import {
  cloneElement,
  Component,
  ReactNode,
  Ref,
  RefCallback,
  RefObject,
} from 'react';
import { findRelevantElementPaths } from '../../shared/findRelevantElementPaths.js';
import { setElementAtPath } from '../../shared/nodeTree/index.js';
import { CachedRefHandlers } from '../shared.js';
import { isRefSupported } from './isRefSupported.js';

type SpyRef = (elPath: string, elRef: null | Component) => unknown;

export function decorateFixtureRefs(
  fixture: ReactNode,
  spyRef: SpyRef,
  cachedRefHandlers: CachedRefHandlers
) {
  const elPaths = findRelevantElementPaths(fixture);
  return elPaths.reduce((decoratedFixture, elPath): ReactNode => {
    return setElementAtPath(decoratedFixture, elPath, element => {
      if (!isRefSupported(element.type)) {
        return element;
      }

      const origRef = element.props.ref as undefined | Ref<unknown>;
      return cloneElement(element, {
        ref: getDecoratedRef(origRef, spyRef, elPath, cachedRefHandlers),
      });
    });
  }, fixture);
}

function getDecoratedRef(
  origRef: undefined | Ref<unknown>,
  spyRef: SpyRef,
  elPath: string,
  cachedRefHandlers: CachedRefHandlers
): RefCallback<unknown> {
  const found = cachedRefHandlers[elPath];
  if (found && found.origRef === origRef) {
    return found.handler;
  }

  const handler = decorateRefWithSpy(origRef, spyRef, elPath);
  cachedRefHandlers[elPath] = { origRef, handler };

  return handler;
}

function decorateRefWithSpy(
  origRef: Ref<unknown> | undefined,
  spyRef: SpyRef,
  elPath: string
): RefCallback<unknown> {
  return (elRef: null | Component) => {
    const callback = origRef ? callOriginalRef(origRef, elRef) : undefined;
    spyRef(elPath, elRef);
    return callback;
  };
}

function callOriginalRef(ref: Ref<unknown>, elRef: null | Component) {
  if (typeof ref === 'string') {
    console.warn('[decorateFixtureRefs] String refs are not supported');
    return;
  }

  if (typeof ref === 'function') {
    return ref(elRef);
  }

  const refObj = ref as RefObject<unknown>;
  refObj.current = elRef;
}
