import { useEffect } from 'react';
import { getFixtureItemFromExport } from './getFixtureList.js';
import { ReactFixtureModule } from './reactTypes.js';
import { RendererConnect } from './types.js';

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
