import { isEqual, mapValues } from 'lodash';
import React from 'react';
import {
  DEFAULT_RENDER_KEY,
  extendWithValues,
  findFixtureStateProps,
  FixtureDecoratorId,
  FixtureState
} from '../../../fixtureState';
import { getComponentName } from '../../../react';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths';
import { getChildrenPath, setElementAtPath } from '../shared/nodeTree';

export function useFixtureProps(
  fixture: React.ReactNode,
  fixtureState: FixtureState,
  decoratorId: FixtureDecoratorId
): React.ReactNode {
  // React.useMemo is used as a cache invalidated by decoratorId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const propCache: Record<string, unknown> = React.useMemo(() => ({}), [
    decoratorId
  ]);

  const elPaths = findRelevantElementPaths(fixture);

  return elPaths.reduce((extendedFixture, elPath): React.ReactNode => {
    const elementId = { decoratorId, elPath };
    const fsProps = findFixtureStateProps(fixtureState, elementId);

    return setElementAtPath(extendedFixture, elPath, element => {
      if (!fsProps || componentTypeChanged(fsProps.componentName)) {
        return {
          ...element,
          key: getElRenderKey(elPath, DEFAULT_RENDER_KEY)
        };
      }

      // Prevent overriding child elements with outdated "children" prop values
      // stored in fixture state
      // See https://github.com/react-cosmos/react-cosmos/pull/920 for context
      const originalProps = element.props;
      const extendedProps = extendWithValues(originalProps, fsProps.values);

      // Preserve identity between renders for indentical non-primitive props
      const cachedProps = mapValues(extendedProps, (value, propName) => {
        const key = getPropCacheKey(elPath, propName);
        if (!propCache.hasOwnProperty(key))
          propCache[key] = originalProps[propName];

        if (isEqual(propCache[key], value)) return propCache[key];

        propCache[key] = value;
        return value;
      });

      // HACK alert: Editing React Element by hand
      // This is blasphemy, but there are two reasons why React.cloneElement
      // isn't ideal:
      //   1. Props need to overridden (not merged)
      //   2. element.key has to be set to control whether the prev instance
      //      should be reused on not
      // Still, in case this method causes trouble in the future, both reasons
      // can be overcome in the following ways:
      //   1. Set original props that aren't present in fixture state to
      //      undefined
      //   2. Create a wrapper component or element and to set the key on
      // Useful links:
      //   - https://reactjs.org/docs/react-api.html#cloneelement
      //   - https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L293-L362
      return {
        ...element,
        props: hasChildElPaths(elPaths, elPath)
          ? { ...cachedProps, children: originalProps.children }
          : cachedProps,
        key: getElRenderKey(elPath, fsProps.renderKey)
      };

      function componentTypeChanged(componentName: string) {
        return componentName !== getComponentName(element.type);
      }
    });
  }, fixture);
}

function getPropCacheKey(elPath: string, propName: string) {
  return elPath ? `${elPath}-${propName}` : propName;
}

function getElRenderKey(elPath: string, renderKey: number) {
  return `${elPath}-${renderKey}`;
}

function hasChildElPaths(elPaths: string[], elPath: string) {
  return elPaths.some(p => p.indexOf(getChildrenPath(elPath)) === 0);
}
