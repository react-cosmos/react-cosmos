/** @jsx React.DOM */

Cosmos.components.MovieHeader = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieHeader",
   *   title: "The Dark Knight",
   *   year: 2008,
   *   posterPath: "http://image.tmdb.org/t/p/w342/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
   *   credits: {...}
   * }
   */
  render: function() {
    return (
      <div className="header">
        <div className="title-wrapper">
          <img className="poster"
               src={this.props.posterPath}
               alt="" />
          <h1 className="title">
            {this.props.title + ' '}
            <span className="year">{this.getYear()}</span>
          </h1>
        </div>
        <Cosmos component="MovieCredits"
                credits={this.props.credits} />
      </div>
    );
  },
  getYear: function() {
    return this.props.year ? '(' + this.props.year + ')' : null;
  }
});
