import { useEffect } from 'react';
import {
  ReactFixtureModule,
  RendererConnect,
  getFixtureItemFromExport,
} from 'react-cosmos-core';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixturePath: string;
  fixtureModule: ReactFixtureModule;
};
export function LazyFixtureListItemUpdate({
  rendererId,
  rendererConnect,
  fixturePath,
  fixtureModule,
}: Props) {
  useEffect(() => {
    rendererConnect.postMessage({
      type: 'fixtureListItemUpdate',
      payload: {
        rendererId,
        fixturePath,
        fixtureItem: getFixtureItemFromExport(fixtureModule.default),
      },
    });
  }, [fixtureModule.default, fixturePath, rendererConnect, rendererId]);

  return null;
}
