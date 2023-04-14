import { isEqual } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getFixtureListFromWrappers } from './getFixtureList.js';
import { UserModuleWrappers } from './reactTypes.js';
import {
  RendererConnect,
  RendererRequest,
  SelectFixtureRequest,
  SetFixtureStateRequest,
} from './types.js';
import { SelectedFixture } from './useSelectedFixture.js';

export function useRendererRequest(
  rendererId: string,
  rendererConnect: RendererConnect,
  moduleWrappers: UserModuleWrappers,
  setSelectedFixture: Dispatch<SetStateAction<SelectedFixture | null>>,
  onErrorReset?: () => unknown
) {
  useEffect(() => {
    function postReadyState() {
      const fixtures = getFixtureListFromWrappers(moduleWrappers);
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: { rendererId, fixtures },
      });
    }

    function fireChangeCallback() {
      if (typeof onErrorReset === 'function') {
        onErrorReset();
      }
    }

    function handleSelectFixtureRequest({ payload }: SelectFixtureRequest) {
      const { fixtureId, fixtureState } = payload;
      setSelectedFixture(prev => {
        return {
          fixtureId,
          fixtureState,
          renderKey: prev ? prev.renderKey + 1 : 0,
        };
      });
    }

    function handleUnselectFixtureRequest() {
      setSelectedFixture(null);
    }

    function handleSetFixtureStateRequest({ payload }: SetFixtureStateRequest) {
      const { fixtureId, fixtureState } = payload;
      setSelectedFixture(prev => {
        // Ensure fixture state applies to currently selected fixture
        if (prev && isEqual(prev.fixtureId, fixtureId)) {
          return { ...prev, fixtureState };
        } else {
          return prev;
        }
      });
    }

    const unsubscribe = rendererConnect.onMessage((msg: RendererRequest) => {
      if (msg.type === 'pingRenderers') {
        return postReadyState();
      }

      if (!msg.payload || msg.payload.rendererId !== rendererId) {
        return;
      }

      const doesRequestChangeFixture =
        msg.type === 'selectFixture' || msg.type === 'unselectFixture';
      if (doesRequestChangeFixture) {
        fireChangeCallback();
      }

      switch (msg.type) {
        case 'selectFixture':
          return handleSelectFixtureRequest(msg);
        case 'unselectFixture':
          return handleUnselectFixtureRequest();
        case 'setFixtureState':
          return handleSetFixtureStateRequest(msg);
        default:
        // Ignore all other messages, which could be unrelated browser
        // devtools communications.
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    moduleWrappers,
    onErrorReset,
    rendererConnect,
    rendererId,
    setSelectedFixture,
  ]);
}
