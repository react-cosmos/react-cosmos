import { ReactNode, useEffect, useRef } from 'react';
import {
  FixtureDecoratorId,
  PropsFixtureState,
  areNodesEqual,
  createPropsFixtureStateItem,
  createValues,
  filterPropsFixtureState,
  findPropsFixtureStateItem,
  getComponentName,
  removePropsFixtureStateItem,
  updatePropsFixtureStateItem,
} from 'react-cosmos-core';
import { useFixtureState } from '../../useFixtureState.js';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths.js';
import {
  getElementAtPath,
  getExpectedElementAtPath,
} from '../shared/nodeTree/index.js';
import { useFixtureProps } from './useFixtureProps.js';

export function usePropsCapture(
  fixture: ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const [propsFs, setPropsFs] = useFixtureState<PropsFixtureState>('props');
  const prevFixtureRef = useRef<ReactNode>(null);
  const elPaths = findRelevantElementPaths(fixture);

  useEffect(() => {
    // Create empty fixture state
    if (!propsFs && elPaths.length === 0) {
      // Make sure not to override any (currently pending) fixture state props
      setPropsFs(prevFs => prevFs ?? []);
      return;
    }

    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also invalidate fixture state at this element path if the
    // component type of the corresponding element changed
    const decoratorFs = filterPropsFixtureState(propsFs, decoratorId);
    decoratorFs.forEach(({ elementId }) => {
      if (elPaths.indexOf(elementId.elPath) === -1) {
        setPropsFs(prevFs => removePropsFixtureStateItem(prevFs, elementId));
      }
    });

    elPaths.forEach(elPath => {
      const childEl = getExpectedElementAtPath(fixture, elPath);
      const elementId = { decoratorId, elPath };
      // Component fixture state can be provided before the fixture mounts (eg.
      // a previous snapshot of a fixture state or the current fixture state
      // from another renderer)
      if (!findPropsFixtureStateItem(propsFs, elementId)) {
        const componentName = getComponentName(childEl.type);
        setPropsFs(prevFs =>
          createPropsFixtureStateItem({
            propsFs: prevFs,
            elementId,
            // @ts-ignore FIXME, can props be non-objects?
            values: createValues(childEl.props),
            componentName,
          })
        );
      } else {
        // This code path is problematic because we can't tell whether:
        // a) This is the first time the fixture renders
        // b) A (suboptimal) HMR update blew up the FixtureCapture instance
        // For this reason we have a tradeoff:
        // - Override new fixture element props with fixture state props values
        // - Override fixture state props with new fixture element props values
        // We chose the latter because it makes HMR more reliable by allowing
        // users to update props in Node fixtures via source code (when HMR
        // isn't working optimally, which might be common.)
        // The downside with this approach is that a renderer that loads a
        // fixture with fixture state will ignore props from the fixture state
        // initially. This is more of an edge case that probably few people will
        // run into. For more context, see:
        // https://github.com/react-cosmos/react-cosmos/pull/1614
        const prevChildEl = getElementAtPath(prevFixtureRef.current, elPath);
        if (!areNodesEqual(prevChildEl, childEl, false)) {
          setPropsFs(prevFs =>
            updatePropsFixtureStateItem({
              propsFs: prevFs,
              elementId,
              // @ts-ignore FIXME, can props be non-objects?
              values: createValues(childEl.props),
            })
          );
        }
      }
    });
  }, [decoratorId, elPaths, fixture, propsFs, setPropsFs]);

  useEffect(() => {
    prevFixtureRef.current = fixture;
  });

  return useFixtureProps(fixture, propsFs, decoratorId);
}
