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
      <div className="movie-header">
        <div className="movie-title-wrapper">
          <img className="movie-poster"
               src={this.props.posterPath}
               alt="" />
          <h1 className="movie-title">
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
