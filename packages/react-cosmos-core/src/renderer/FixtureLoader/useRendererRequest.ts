import { isEqual } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { getFixtureListFromLazyWrappers } from '../getFixtureList.js';
import { LazyReactFixtureWrappersByPath } from '../reactTypes.js';
import {
  RendererConnect,
  RendererRequest,
  SelectFixtureRequest,
  SetFixtureStateRequest,
} from '../types.js';
import { SelectedFixture } from './useSelectedFixture.js';

export function useRendererRequest(
  rendererId: string,
  rendererConnect: RendererConnect,
  fixtureWrappersByPath: LazyReactFixtureWrappersByPath,
  setSelectedFixture: Dispatch<SetStateAction<SelectedFixture | null>>,
  setRenderKey: Dispatch<SetStateAction<number>>,
  onErrorReset?: () => unknown
) {
  useEffect(() => {
    function postReadyState() {
      const fixtures = getFixtureListFromLazyWrappers(fixtureWrappersByPath);
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
      setSelectedFixture({ fixtureId, fixtureState });
      setRenderKey(prev => prev + 1);
    }

    function handleUnselectFixtureRequest() {
      setSelectedFixture(null);
      setRenderKey(0);
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
    fixtureWrappersByPath,
    onErrorReset,
    rendererConnect,
    rendererId,
    setRenderKey,
    setSelectedFixture,
  ]);
}
