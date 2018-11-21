// @flow

// TODO: Pick up initial states automatically via plugin API
export function getInitialState() {
  return {
    renderers: require('../plugins/RendererMessageHandler/getInitialState').getInitialState(),
    urlParams: require('../plugins/Router/getInitialState').getInitialState()
  };
}
