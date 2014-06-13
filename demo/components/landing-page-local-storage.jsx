/** @jsx React.DOM */

Cosmos.components.LandingPageLocalStorage = React.createClass({
  /**
   * Persist landing page data inside local storage.
   */
  mixins: [Cosmos.mixins.PersistState],
  children: {
    landingPage: function() {
      // Unload previous state from local storage if present, otherwise
      // generate a landing page with a blank Flatris instance
      var prevSnapshot = localStorage.getItem('landingPageState');
      if (prevSnapshot) {
        return JSON.parse(prevSnapshot);
      } else {
        return {
          component: 'LandingPage'
        };
      }
    }
  },
  componentDidMount: function() {
    $(window).on('unload', this.onUnload);
  },
  componentWillUnmount: function() {
    $(window).off('unload', this.onUnload);
  },
  render: function() {
    return this.loadChild('landingPage');
  },
  onUnload: function() {
    var snapshot = this.refs.landingPage.generateSnapshot(true);
    localStorage.setItem('landingPageState', JSON.stringify(snapshot));
  }
});
