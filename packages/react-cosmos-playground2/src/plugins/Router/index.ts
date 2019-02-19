import { isEqual } from 'lodash';
import { PluginContext, createPlugin } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  getUrlParamsFromLocation,
  pushUrlParamsToHistory,
  subscribeToLocationChanges
} from './window';
import { UrlParams, RouterSpec } from './public';

type Context = PluginContext<RouterSpec>;

const { onLoad, register } = createPlugin<RouterSpec>({
  name: 'router',
  initialState: {
    urlParams: {}
  },
  methods: {
    getSelectedFixtureId,
    isFullScreen,
    selectFixture,
    unselectFixture
  }
});

onLoad(context => {
  const { setState } = context;

  setState({
    urlParams: getUrlParamsFromLocation()
  });

  return subscribeToLocationChanges((urlParams: UrlParams) => {
    const { fixtureId } = context.getState().urlParams;
    const hasFixtureChanged = urlParams.fixtureId !== fixtureId;

    setState({ urlParams }, () => {
      if (hasFixtureChanged) {
        emitFixtureChangeEvent(context);
      }
    });
  });
});

export { register };

function getSelectedFixtureId({ getState }: Context) {
  return getState().urlParams.fixtureId || null;
}

function isFullScreen({ getState }: Context) {
  return getState().urlParams.fullScreen || false;
}

function selectFixture(
  context: Context,
  fixtureId: FixtureId,
  fullScreen: boolean
) {
  setUrlParams(context, { fixtureId, fullScreen });
}

function unselectFixture(context: Context) {
  setUrlParams(context, {});
}

function setUrlParams(context: Context, nextUrlParams: UrlParams) {
  const { urlParams } = context.getState();
  const fixtureChanged = !isEqual(nextUrlParams.fixtureId, urlParams.fixtureId);
  const urlParamsEqual = isEqual(nextUrlParams, urlParams);

  context.setState({ urlParams: nextUrlParams }, () => {
    // Setting identical url params is considered a "reset" request
    if (fixtureChanged || urlParamsEqual) {
      emitFixtureChangeEvent(context);
    }

    if (!urlParamsEqual) {
      pushUrlParamsToHistory(context.getState().urlParams);
    }
  });
}

function emitFixtureChangeEvent(context: Context) {
  context.emit('fixtureChange', getSelectedFixtureId(context));
}
