import React from 'react';
import {
  FixtureId,
  UserModuleWrappers,
  getFixtureListFromWrappers,
} from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';
import { FixtureLoaderSelection } from './useFixtureLoaderState.js';

type Props = {
  moduleWrappers: UserModuleWrappers;
  selection: FixtureLoaderSelection | null;
  initialFixtureId?: FixtureId | null;
  renderMessage: (msg: string) => React.ReactElement;
  renderNoFixtureSelected?: boolean;
  renderFixture: (selection: FixtureLoaderSelection) => React.ReactElement;
};
export function FixtureSelector({
  moduleWrappers,
  selection = null,
  initialFixtureId = null,
  renderMessage,
  renderNoFixtureSelected,
  renderFixture,
}: Props) {
  const fixtures = React.useMemo(
    () => getFixtureListFromWrappers(moduleWrappers),
    [moduleWrappers]
  );

  const { rendererId, rendererConnect } = React.useContext(RendererContext);

  const readyRef = React.useRef(false);
  React.useEffect(() => {
    if (readyRef.current) {
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    } else {
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
      readyRef.current = true;
    }
  }, [fixtures, initialFixtureId, rendererConnect, rendererId]);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (msg.type === 'pingRenderers') {
          rendererConnect.postMessage({
            type: 'rendererReady',
            payload: { rendererId, fixtures },
          });
        }
      }),
    [fixtures, rendererConnect, rendererId]
  );

  if (!selection) {
    return renderNoFixtureSelected
      ? renderMessage('No fixture selected.')
      : null;
  }

  const { fixtureId } = selection;
  if (!fixtures[fixtureId.path]) {
    return renderMessage(`Fixture path not found: ${fixtureId.path}`);
  }

  return renderFixture(selection);
}
