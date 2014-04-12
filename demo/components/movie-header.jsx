/** @jsx React.DOM */

Cosmos.components.MovieHeader = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "MovieHeader",
   *   title: "The Dark Knight",
   *   year: 2008,
   *   posterPath: "http://image.tmdb.org/t/p/w342/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
   *   credits: {
   *     crew: [...],
   *     cast: [...]
   *   }
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
            <span className="year">({this.props.year})</span>
          </h1>
        </div>
        <Cosmos component="MovieCredits"
                cast={this.props.credits.cast}
                crew={this.props.credits.crew} />
      </div>
    );
  }
});
