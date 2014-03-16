Cosmos.mixins.Url = {
  /**
   * Enables basic linking between Components, with optional use of the minimal
   * built-in Router.
   */
  getUrlFromProps: function(props) {
    /**
     * Serializes a props object into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag, and
     * can be combined with the generateSnapshot method of the PersistState
     * Mixin to create a link that opens the current Component at root level
     * (full window.)
     */
    return '?' + Cosmos.serialize.getQueryStringFromProps(props);
  },
  routeLink: function(e) {
    /**
     * Any <a> tag can have this method bound to its onClick event to have
     * their corresponding href location picked up by the built-in Router
     * implementation, which uses pushState to switch between Components
     * instead of reloading pages.
     */
    e.preventDefault();
    var anchor = e.currentTarget;
    Cosmos.router.goTo($(anchor).attr('href'), this._getOriginBounds(anchor));
  },
  _getOriginBounds: function(anchorElement) {
    // Get the closest Component ancestor of anchor element
    var $parentComponent = $(this.getDOMNode()),
        $parentContainer =
          $parentComponent.closest('.' + Cosmos.Router.CONTAINER_CLASS),
        componentOffset = $parentComponent.offset(),
        containerOffset = $parentContainer.offset();
    // Cosmos doesn't need to run in the body element directly, so we need to
    // calculate relative offsets
    if (containerOffset) {
      componentOffset.left -= containerOffset.left;
      componentOffset.top -= containerOffset.top;
    }
    return {
      width: $parentComponent.outerWidth(),
      height: $parentComponent.outerHeight(),
      x: componentOffset.left,
      y: componentOffset.top
    };
  }
};
