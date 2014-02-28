Fresh.mixins.Url = {
  /**
   * Enables basic linking between Components, with optional use of the minimal
   * built-in Router.
   *
   * Methods:
   *   - getUrlFromProps: Serializes a props object into a browser-complient
   *                      URL. The URL generated can be simply put inside the
   *                      href attribute of an <a> tag, and can be combined
   *                      with the generateSnapshot method of the PersistState
   *                      Mixin to create a link that opens the current
   *                      Component at root level (full window.)
   *   - routeLink: Any <a> tag can have this method bound to its onClick event
   *                to have their corresponding href location picked up by the
   *                built-in Router implementation, which uses pushState to
   *                switch between Components instead of reloading pages.
   */
  getUrlFromProps: function(props) {
    return '?' + Fresh.serialize.getQueryStringFromProps(props);
  },
  routeLink: function(e) {
    e.preventDefault();
    Fresh.router.goTo(e.currentTarget.getAttribute('href'));
  }
};
