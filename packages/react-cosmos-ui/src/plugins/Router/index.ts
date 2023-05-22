import { isEqual } from 'lodash-es';
import { FixtureId, PlaygroundParams } from 'react-cosmos-core';
import { PluginContext, createPlugin } from 'react-plugin';
import {
  getUrlParams,
  pushUrlParams,
  subscribeToLocationChanges,
} from '../../shared/url.js';
import { RouterSpec } from './spec.js';

type RouterContext = PluginContext<RouterSpec>;

const { onLoad, register } = createPlugin<RouterSpec>({
  name: 'router',
  initialState: {
    urlParams: {},
  },
  methods: {
    getSelectedFixtureId,
    selectFixture,
    unselectFixture,
  },
});

onLoad(context => {
  const { setState } = context;
  setState({ urlParams: getUrlParams() });

  return subscribeToLocationChanges((urlParams: PlaygroundParams) => {
    const { fixtureId } = context.getState().urlParams;
    const fixtureChanged = !isEqual(urlParams.fixtureId, fixtureId);

    setState({ urlParams }, () => {
      if (fixtureChanged) {
        emitFixtureChangeEvent(context);
      }
    });
  });
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getSelectedFixtureId({ getState }: RouterContext) {
  return getState().urlParams.fixtureId || null;
}

function selectFixture(context: RouterContext, fixtureId: FixtureId) {
  setUrlParams(context, { fixtureId });
}

function unselectFixture(context: RouterContext) {
  setUrlParams(context, {});
}

function setUrlParams(context: RouterContext, nextUrlParams: PlaygroundParams) {
  const { urlParams } = context.getState();
  const urlParamsEqual = isEqual(nextUrlParams, urlParams);

  if (urlParamsEqual) {
    // Setting identical url params can be considered a "reset" request, but
    // this will only re-render the fixture if the renderer implements an
    // auto-incrementing render key in its state
    emitFixtureChangeEvent(context);
  } else {
    context.setState({ urlParams: nextUrlParams }, () => {
      pushUrlParams(context.getState().urlParams);
      emitFixtureChangeEvent(context);
    });
  }
}

function emitFixtureChangeEvent(context: RouterContext) {
  context.emit('fixtureChange', getSelectedFixtureId(context));
}
