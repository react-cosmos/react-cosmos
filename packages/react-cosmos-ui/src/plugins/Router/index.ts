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
  defaultConfig: {
    initialFixtureId: null,
  },
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
  const { getConfig, setState } = context;

  const urlParams = getUrlParams();
  setState({ urlParams });

  const { initialFixtureId } = getConfig();
  if (initialFixtureId && !urlParams.fixture) {
    selectFixture(context, initialFixtureId);
  }

  return subscribeToLocationChanges((nextUrlParams: PlaygroundParams) => {
    const { fixture } = context.getState().urlParams;
    const fixtureChanged = !isEqual(nextUrlParams.fixture, fixture);

    setState({ urlParams: nextUrlParams }, () => {
      if (fixtureChanged) {
        emitFixtureChangeEvent(context, true);
      }
    });
  });
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getSelectedFixtureId({ getState }: RouterContext) {
  return getState().urlParams.fixture || null;
}

function selectFixture(context: RouterContext, fixtureId: FixtureId) {
  setUrlParams(context, { fixture: fixtureId });
}

function unselectFixture(context: RouterContext) {
  setUrlParams(context, {});
}

function setUrlParams(context: RouterContext, nextUrlParams: PlaygroundParams) {
  const { urlParams } = context.getState();
  const fixtureChanged = !isEqual(nextUrlParams.fixture, urlParams.fixture);
  const urlParamsEqual = isEqual(nextUrlParams, urlParams);

  if (urlParamsEqual) {
    // Setting identical URL params can be considered a "reset" request, but
    // this will only re-render the fixture if the renderer implements an
    // auto-incrementing render key in its state
    emitFixtureChangeEvent(context, false);
  } else {
    context.setState({ urlParams: nextUrlParams }, () => {
      pushUrlParams(context.getState().urlParams);
      emitFixtureChangeEvent(context, fixtureChanged);
    });
  }
}

function emitFixtureChangeEvent(
  context: RouterContext,
  fixtureChanged: boolean
) {
  const fixtureId = getSelectedFixtureId(context);
  if (!fixtureId) {
    context.emit('fixtureUnselect');
  } else if (fixtureChanged) {
    context.emit('fixtureSelect', fixtureId);
  } else {
    context.emit('fixtureReselect', fixtureId);
  }
}
