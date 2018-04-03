// @flow

import type { LinkedItem } from 'react-cosmos-flow/linked-list';

export function createLinkedList<Item>(items: Array<Item>): LinkedItem<Item> {
  function advanceList(toIndex: number): LinkedItem<Item> {
    return {
      value: items[toIndex],
      next: function getNextItem(nextIndex: number): LinkedItem<Item> {
        return advanceList(nextIndex);
      }.bind(null, toIndex + 1)
    };
  }

  return advanceList(0);
}
