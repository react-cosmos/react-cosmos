Fresh.RouterHistory = function() {
  /**
   * Stores a history of previous Component states with a stateful index
   * pointing to a current position in this history. Similar to the native
   * pushState implementation, but with access to all previous states (that
   * can be updated at any time.) The states are also uniquely identified by
   * stringifying them. This allows reusing previous states and detecting
   * transition types, like going back to a previous state instead of loading
   * it again from scratch.
   *
   * See "push" method to understand how are state transitioned.
   */
};
Fresh.RouterHistory.transitionTypes = {
  NOOP: 0,
  INITIAL: 1,
  BACK: 2,
  FORWARD: 3
};
Fresh.RouterHistory.prototype = _.extend([], {
  _push: Array.prototype.push,
  push: function(props) {
    /**
     * Pushing a new set of Component props into the history can unfold in more
     * than one way. The transitionTypes paint the big picture, but there's
     * more to consider. When the history already has more than one entry you
     * can go both back in time or Back to the Future™ by pushing the same
     * props as either the prev or the next direct-neighbour entry. If an entry
     * is pushed that does not match any of the surrounding neighbours of the
     * current one it will create a FORWARD transition and will erase any other
     * previous future.
     *
     * TODO: Implement max past limit, since past history never gets removed
     */
    var queryString = Fresh.serialize.getQueryStringFromProps(props);

    if (!this.length) {
      this.index = 0;
      this._push({queryString: queryString, props: props});
      return Fresh.RouterHistory.transitionTypes.INITIAL;
    }
    var currentEntry = this[this.index],
        prevEntry = this[this.index - 1] || {},
        nextEntry = this[this.index + 1] || {};

    if (queryString == currentEntry.queryString) {
      // No transition is needed if we're trying to open the same configuration
      return Fresh.RouterHistory.transitionTypes.NOOP;
    }
    if (queryString == prevEntry.queryString) {
      // We're going back
      this.index--;
      return Fresh.RouterHistory.transitionTypes.BACK;
    }
    // We're going forward
    this.index++;
    if (queryString != nextEntry.queryString) {
      // We're starting a new point in the future
      this.splice(this.index, this.length - this.index);
      this._push({queryString: queryString, props: props});
    }
    return Fresh.RouterHistory.transitionTypes.FORWARD;
  }
});
