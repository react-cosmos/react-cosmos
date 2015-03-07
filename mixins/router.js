var serialize = require('../lib/serialize.js');

module.exports = {
  /**
   * Enables basic linking between Components, with optional use of the minimal
   * built-in Router.
   */
  getUrlFromProps: function(props) {
    /**
     * Serializes a props object into a browser-complient URL. The URL
     * generated can be simply put inside the href attribute of an <a> tag, and
     * can be combined with the serialize method of the ComponentTree Mixin to
     * create a link that opens the current Component at root level
     * (full window.)
     */
    return '?' + serialize.getQueryStringFromProps(props);
  },

  routeLink: function(event) {
    /**
     * Any <a> tag can have this method bound to its onClick event to have
     * their corresponding href location picked up by the built-in Router
     * implementation, which uses pushState to switch between Components
     * instead of reloading pages.
     */
    event.preventDefault();
    this.props.router.goTo(event.currentTarget.href);
  }
};
