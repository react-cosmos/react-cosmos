export default function createLinkedList(items) {
  function advanceList(toIndex) {
    return {
      value: items[toIndex],
      next: function getNextItem(nextIndex) {
        return advanceList(nextIndex);
      }.bind(null, toIndex + 1),
    };
  }

  return advanceList(0);
}
