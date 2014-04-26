/** @jsx React.DOM */

Cosmos.components.DemoHeader = React.createClass({
  /**
   * Just a disclaimer about this being a demo about the Cosmos JavaScript
   * framework consuming TMDb API
   */
  render: function() {
    return (
      <p className="demo-header">This is a proof of concept demo for the
        <strong>Cosmos JavaScript framework,</strong> consuming the
        <a href="https://www.themoviedb.org/">TMDb</a> API. A rudimentary
        example of how easy you explore data with Cosmos, without even controlling the data format. See how fast you navigate between
        Movies and People, especially when going
        <em>back</em> and <em>forward</em> into the browser history.
        <a href="https://github.com/skidding/cosmos" className="github-link">
        <strong>Go to GitHub for specs and source code &raquo;</strong></a>
      </p>
    );
  }
});
