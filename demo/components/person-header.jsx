/** @jsx React.DOM */

Cosmos.components.PersonHeader = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "PersonHeader",
   *   name: "Christopher Nolan",
   *   birthday: "July 30, 1970",
   *   birthplace: "London, England, UK",
   *   profilePath: "/7OGmfDF4VHLLgbjxuEwTj3ga0uQ.jpg"
   * }
   */
  render: function() {
    return (
      <div className="header">
        <div className="title-wrapper">
          <img className="poster"
               src={this.props.profilePath}
               alt="" />
          <h1 className="title">
            {this.props.name + ' '}
          </h1>
          <p>Born {this.props.birthday} in <strong>{this.props.birthplace}.</strong></p>
        </div>
      </div>
    );
  }
});
