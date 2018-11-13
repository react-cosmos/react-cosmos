// @flow

// TODO: Pick up initial states automatically via plugin API
export function getInitialState() {
  return {
    renderer: require('../plugins/RendererResponseHandler/getInitialState').getInitialState(),
    router: require('../plugins/Router/getInitialState').getInitialState()
  };
}
