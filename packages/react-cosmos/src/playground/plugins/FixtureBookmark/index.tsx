import { isEqual } from 'lodash';
import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { createFixtureTree } from 'react-cosmos-core/fixtureTree';
import { flattenFixtureTree } from 'react-cosmos-core/fixtureTree';
import { FixtureId } from 'react-cosmos-core/fixture';
import { FixtureActionSlotProps } from '../../slots/FixtureActionSlot.js';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { BookmarkFixtureButton } from './BookmarkFixtureButton.js';
import { FixtureBookmarks } from './FixtureBookmarks.js';
import { FixtureBookmarkSpec } from './spec.js';

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

if (process.env.NODE_ENV !== 'test') register();

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
