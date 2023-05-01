import { useEffect } from 'react';
import { getFixtureItemFromExport } from '../shared/getFixtureList.js';
import { RendererConnect } from '../shared/rendererConnectTypes.js';
import { ReactFixtureModule } from '../shared/userModuleTypes.js';

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
