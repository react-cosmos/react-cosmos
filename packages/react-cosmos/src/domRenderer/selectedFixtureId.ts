import { FixtureId } from 'react-cosmos-shared2/renderer';
import { parseRendererUrlQuery } from 'react-cosmos-shared2/url';

export function getSelectedFixtureId(): undefined | FixtureId {
  const { _fixtureId } = parseRendererUrlQuery(location.search);
  return _fixtureId;
}
