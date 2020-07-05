import { isEqual } from 'lodash';
import React from 'react';
import {
  createFixtureTree,
  flattenFixtureTree,
} from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { FixtureActionSlotProps } from '../../shared/slots/FixtureActionSlot';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { BookmarkFixtureButton } from './BookmarkFixtureButton';
import { FixtureBookmarks } from './FixtureBookmarks';
import { FixtureBookmarkSpec } from './public';

type FixtureBookmarkContext = PluginContext<FixtureBookmarkSpec>;

const { namedPlug, register } = createPlugin<FixtureBookmarkSpec>({
  name: 'fixtureBookmark',
});

namedPlug<FixtureActionSlotProps>(
  'fixtureAction',
  'bookmarkFixture',
  ({ pluginContext, slotProps }) => {
    const { fixtureId } = slotProps;
    const { getBookmarks, setBookmarks } = getStorageApi(pluginContext);

    const bookmarks = getBookmarks();
    const selected = bookmarks.some(b => isEqual(b, fixtureId));

    return (
      <BookmarkFixtureButton
        selected={selected}
        onClick={() =>
          setBookmarks(
            selected
              ? bookmarks.filter(b => !isEqual(b, fixtureId))
              : [...bookmarks, fixtureId]
          )
        }
      />
    );
  }
);

namedPlug<FixtureActionSlotProps>(
  'navRow',
  'fixtureBookmarks',
  ({ pluginContext }) => {
    const router = pluginContext.getMethodsOf<RouterSpec>('router');
    const { getBookmarks, setBookmarks } = getStorageApi(pluginContext);
    const bookmarks = getBookmarks();
    const fixtureItems = useFixtureItems(pluginContext);

    return (
      <FixtureBookmarks
        fixtureItems={fixtureItems}
        bookmarks={bookmarks}
        selectedFixtureId={router.getSelectedFixtureId()}
        onFixtureSelect={router.selectFixture}
        onBookmarkDelete={fixtureId =>
          setBookmarks(bookmarks.filter(b => !isEqual(b, fixtureId)))
        }
      />
    );
  }
);

export { register };

function getStorageApi(pluginContext: FixtureBookmarkContext) {
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');

  function getBookmarks() {
    return storage.getItem<FixtureId[]>('fixtureBookmarks') || [];
  }

  function setBookmarks(bookmarks: FixtureId[]) {
    storage.setItem<FixtureId[]>('fixtureBookmarks', bookmarks);
  }

  return { getBookmarks, setBookmarks };
}

function useFixtureItems(pluginContext: FixtureBookmarkContext) {
  const { getMethodsOf } = pluginContext;

  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();

  return React.useMemo(
    () =>
      flattenFixtureTree(
        createFixtureTree({ fixturesDir, fixtureFileSuffix, fixtures })
      ),
    [fixtureFileSuffix, fixtures, fixturesDir]
  );
}
