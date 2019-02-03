import { isEqual } from 'lodash';
import { IPluginContext, createPlugin } from 'react-plugin';
import {
  getUrlParamsFromLocation,
  pushUrlParamsToHistory,
  subscribeToLocationChanges
} from './window';
import { UrlParams, RouterSpec } from './public';

type Context = IPluginContext<RouterSpec>;

const { onLoad, register } = createPlugin<RouterSpec>({
  name: 'router',
  initialState: {
    urlParams: {}
  },
  methods: {
    getUrlParams,
    setUrlParams
  }
});

onLoad(context => {
  const { setState } = context;

  setState({
    urlParams: getUrlParamsFromLocation()
  });

  return subscribeToLocationChanges((urlParams: UrlParams) => {
    const { fixturePath } = getUrlParams(context);
    const hasFixtureChanged = urlParams.fixturePath !== fixturePath;

    setState({ urlParams }, () => {
      if (hasFixtureChanged) {
        emitFixtureChangeEvent(context);
      }
    });
  });
});

export { register };

function getUrlParams(context: Context) {
  return context.getState().urlParams;
}

function setUrlParams(context: Context, nextUrlParams: UrlParams) {
  const urlParams = getUrlParams(context);
  const hasFixtureChanged = nextUrlParams.fixturePath !== urlParams.fixturePath;
  const areUrlParamsEqual = isEqual(nextUrlParams, urlParams);

  context.setState({ urlParams: nextUrlParams }, () => {
    // Setting identical url params is considered a "reset" request
    if (hasFixtureChanged || areUrlParamsEqual) {
      emitFixtureChangeEvent(context);
    }

    if (!areUrlParamsEqual) {
      pushUrlParamsToHistory(getUrlParams(context));
    }
  });
}

function emitFixtureChangeEvent(context: Context) {
  const { emit } = context;
  const { fixturePath } = getUrlParams(context);

  emit('fixtureChange', fixturePath || null);
}
