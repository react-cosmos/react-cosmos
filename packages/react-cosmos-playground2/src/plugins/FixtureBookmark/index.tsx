import { isEqual } from 'lodash';
import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { FixtureActionSlotProps } from '../../shared/slots/FixtureActionSlot';
import { StorageSpec } from '../Storage/public';
import { BookmarkFixtureButton } from './BookmarkFixtureButton';
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
