import { FixtureId } from '../types';
import { parseRendererUrlQuery } from '../../playground/playgroundUrl';
import { isInsideCosmosPreviewIframe } from './isInsideCosmosPreviewIframe';

export const selectedFixtureId = getSelectedFixtureId();

// The selected fixture ID is stored in session because components might change
// the URL as a side effect. This means that after the renderer stores the
// fixture ID initially, the renderer window can be refreshed and the same
// fixture will be selected even if the URL no longer contains the fixture ID.
function getSelectedFixtureId(): null | FixtureId {
  const urlParams = parseRendererUrlQuery(location.search);
  if (urlParams._fixtureId) {
    setFixtureIdToSession(urlParams._fixtureId);
    return urlParams._fixtureId;
  }

  return getFixtureIdFromSession();
}

function setFixtureIdToSession(fixtureId: FixtureId) {
  sessionStorage.setItem('cosmosFixtureId', JSON.stringify(fixtureId));
}

function getFixtureIdFromSession(): null | FixtureId {
  if (isInsideCosmosPreviewIframe()) {
    return null;
  }

  const stringifiedFixtureId = sessionStorage.getItem('cosmosFixtureId');
  return stringifiedFixtureId ? JSON.parse(stringifiedFixtureId) : null;
}
