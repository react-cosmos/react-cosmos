/** @jsx React.DOM */

Cosmos.components.Movie = React.createClass({
  mixins: [Cosmos.mixins.ClassName,
           Cosmos.mixins.DataFetch,
           Cosmos.mixins.PersistState],
  defaultClass: 'movie full-background',
  render: function() {
    if (_.isEmpty(this.state.data)) {
      return (
        <div className={this.getClassName()}>
          <p className="loading">loading...</p>
        </div>
      );
    }
    var backgroundStyle = {
          // We load the SD version first, since we already have it in cache
          // from the thumbnail leading to this movie
          backgroundImage: 'url(' + this.getUrlForBackgroundImage(780) + '),' +
                           'url(' + this.getUrlForBackgroundImage(154) + ')'
        },
        similarMovies = this.getSimilarMovies();
    return (
      <div className={this.getClassName()} style={backgroundStyle}>
        <div className="full-background-content">
          <div className="content-wrapper">
            <h1 className="movie-title">
              {this.state.data.title + ' '}
              <span className="year">({this.getReleaseYear()})</span>
            </h1>
            <Cosmos component="MovieCredits"
                    cast={this.state.data.credits.cast}
                    crew={this.state.data.credits.crew} />
            <p className="movie-plot">{this.state.data.overview}</p>
            <p className="similar-to">similar to...</p>
            <Cosmos component="List"
                    itemComponent="MovieThumbnail"
                    class="movie-list"
                    state={{data: this.getSimilarMovies()}} />
          </div>
        </div>
      </div>
    );
  },
  getReleaseYear: function() {
    return new Date(this.state.data.release_date).getFullYear();
  },
  getSimilarMovies: function() {
    var movies = this.state.data.similar_movies.results || [];
    // Can't show thumbnails without images
    movies = _.filter(movies, function(movie) {
      return !!movie.poster_path;
    });
    // Sort them by vote_average, descending
    movies = _.sortBy(movies, function(movie) {
      // Movies with less than 5 votes go to right
      var average = movie.vote_count > 5 ? movie.vote_average : 0;
      return -average;
    });
    return movies;
  },
  getUrlForBackgroundImage: function(size) {
    return App.MOVIEDB_IMG_ROOT + '/w' + size + this.getPosterPath();
  },
  getPosterPath: function() {
    // The poster path can be sent directly through props to load an already
    // cached image
    return this.props.posterPath || this.state.data.poster_path;
  }
});
