import { useEffect } from 'react';
import { getFixtureItemFromExport } from './getFixtureList.js';
import { RendererConnect } from './rendererConnectTypes.js';
import { ReactFixtureModule } from './userModuleTypes.js';

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
