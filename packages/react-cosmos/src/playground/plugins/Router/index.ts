import { isEqual } from 'lodash';
import { createPlugin, PluginContext } from 'react-plugin';
import { PlaygroundUrlParams } from 'react-cosmos-core/playground';
import { FixtureId } from 'react-cosmos-core/fixture';
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

  return subscribeToLocationChanges((urlParams: PlaygroundUrlParams) => {
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

function setUrlParams(
  context: RouterContext,
  nextUrlParams: PlaygroundUrlParams
) {
  const { urlParams } = context.getState();
  const fixtureChanged = !isEqual(nextUrlParams.fixtureId, urlParams.fixtureId);
  const urlParamsEqual = isEqual(nextUrlParams, urlParams);

  context.setState({ urlParams: nextUrlParams }, () => {
    // Setting identical url params is considered a "reset" request
    if (fixtureChanged || urlParamsEqual) {
      emitFixtureChangeEvent(context);
    }

    if (!urlParamsEqual) {
      pushUrlParams(context.getState().urlParams);
    }
  });
}

function emitFixtureChangeEvent(context: RouterContext) {
  context.emit('fixtureChange', getSelectedFixtureId(context));
}
