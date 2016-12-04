import createLinkedList from '../linked-list';

const items = [{}, {}, {}];
const firstItem = createLinkedList(items);

test('first item', () => {
  expect(firstItem.value).toBe(items[0]);
});

test('second item', () => {
  expect(firstItem.next().value).toBe(items[1]);
});

test('second item again', () => {
  expect(firstItem.next().value).toBe(items[1]);
});

test('third item', () => {
  expect(firstItem.next().next().value).toBe(items[2]);
});
