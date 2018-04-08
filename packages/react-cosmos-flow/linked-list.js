// @flow

export type LinkedItem<Item> = {
  value: Item,
  next: () => LinkedItem<Item>
};
