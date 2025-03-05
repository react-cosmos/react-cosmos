import { isEqual } from 'lodash-es';
import React from 'react';
import { FlatFixtureTree } from 'react-cosmos-core';
import { createPlugin, PluginContext } from 'react-plugin';
import { FixtureActionSlotProps } from '../../slots/FixtureActionSlot.js';
import { RootSpec } from '../Root/spec.js';
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
    const { fixtureItem } = slotProps;
    const { getBookmarks, setBookmarks } = getStorageApi(pluginContext);

    const bookmarks = getBookmarks();
    const selected = bookmarks.some(b => isEqual(b, fixtureItem));

    return (
      <BookmarkFixtureButton
        selected={selected}
        onClick={() =>
          setBookmarks(
            selected
              ? bookmarks.filter(b => !isEqual(b, fixtureItem))
              : [...bookmarks, fixtureItem]
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
    const root = pluginContext.getMethodsOf<RootSpec>('root');
    const { getBookmarks, setBookmarks } = getStorageApi(pluginContext);
    const bookmarks = getBookmarks();

    return (
      <FixtureBookmarks
        bookmarks={bookmarks}
        selectedFixtureId={router.getSelectedFixtureId()}
        onFixtureSelect={fixtureId => {
          router.selectFixture(fixtureId);
          if (!root.arePanelsLocked()) root.closeFixtureList();
        }}
        onBookmarkDelete={fixtureItem =>
          setBookmarks(bookmarks.filter(b => !isEqual(b, fixtureItem)))
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
    return storage.getItem<FlatFixtureTree>('fixtureBookmarks.1') || [];
  }

  function setBookmarks(bookmarks: FlatFixtureTree) {
    storage.setItem<FlatFixtureTree>('fixtureBookmarks.1', bookmarks);
  }

  return { getBookmarks, setBookmarks };
}
