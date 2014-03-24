Cosmos.RouterHistory = function() {
  /**
   * Stores a history of previous Component states with a stateful index
   * pointing to a current position in this history. Similar to the native
   * pushState implementation, but with access to all previous states (that
   * can be updated at any time.) The states are also uniquely identified by
   * stringifying them. This allows reusing previous states and transitioning
   * between them, like going back to a previous state and just rendering it
   * instead of loading it again from scratch.
   *
   * See "push" method to understand how are state transitioned.
   */
};
_.extend(Cosmos.RouterHistory, {
  transitionTypes: {
    NOOP: 0,
    INITIAL: 1,
    NEW: 2,
    BACK: 3,
    FORWARD: 4
  },
  prototype: _.extend([], {
    _push: Array.prototype.push,
    push: function(historyEntry) {
      /**
       * Pushing a new entry into the history can unfold in more than one way.
       * The transitionTypes paint the big picture, but there's more to consider.
       * When the history already has more than one entry you can go both back in
       * time or Back to the Future™ by pushing the same props as either the prev
       * or the next direct-neighbour entry. If an entry is pushed that does not
       * match any of the surrounding neighbours of the current entry, it will
       * create a FORWARD transition and will erase any other previous future.
       *
       * Here's an example of a history entry object. It can have any other data
       * attached to it, besides the required props.
       *
       *   {
       *     props: {
       *       component: 'List',
       *       data: 'users.json'
       *     },
       *     metaData: {
       *       foo: 'bar'
       *     }
       *   }
       *
       * TODO: Implement max past limit, past history never gets removed
       */
      // We cache the stringified queryString for faster comparison between
      // entries
      historyEntry.queryString =
        Cosmos.serialize.getQueryStringFromProps(historyEntry.props);

      if (!this.length) {
        this.index = 0;
        this._push(historyEntry);
        return Cosmos.RouterHistory.transitionTypes.INITIAL;
      }
      var currentEntry = this[this.index],
          prevEntry = this[this.index - 1] || {},
          nextEntry = this[this.index + 1] || {};

      if (historyEntry.queryString == currentEntry.queryString) {
        // No transition is needed if we're trying to open the same configuration
        return Cosmos.RouterHistory.transitionTypes.NOOP;
      }
      if (historyEntry.queryString == prevEntry.queryString) {
        // We're going back
        this.index--;
        return Cosmos.RouterHistory.transitionTypes.BACK;
      }
      this.index++;
      if (historyEntry.queryString == nextEntry.queryString) {
        // We're going back in the future. The latest meta data is most
        // relevant in a forward transition, only the previous state is reused
        this._mergeEntryMataData(this[this.index], historyEntry);
        return Cosmos.RouterHistory.transitionTypes.FORWARD;
      }
      // We're starting a new point in the future
      this.splice(this.index, this.length - this.index);
      this._push(historyEntry);
      return Cosmos.RouterHistory.transitionTypes.NEW;
    },
    canReusePropsInHistory: function(props) {
      /**
       * Helper method for checking if a set of props will be reused from current
       * history or will create a new entry (NEW transition type.)
       */
      if (!this.length) {
        return false;
      }
      var queryString = Cosmos.serialize.getQueryStringFromProps(props),
          currentEntry = this[this.index],
          prevEntry = this[this.index - 1] || {},
          nextEntry = this[this.index + 1] || {};
      return queryString == currentEntry.queryString ||
             queryString == prevEntry.queryString ||
             queryString == nextEntry.queryString;
    },
    _mergeEntryMataData: function(targetEntry, sourceEntry) {
      for (var k in sourceEntry) {
        if (k != 'queryString' && k != 'props') {
          targetEntry[k] = sourceEntry[k];
        }
      }
    }
  })
});
