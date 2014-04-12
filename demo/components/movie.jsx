/** @jsx React.DOM */

Cosmos.components.Movie = React.createClass({
  /**
   * Expected input:
   * {
   *   component: "Movie",
   *   id: 155
   * }
   * Expected state:
   * {
   *   data: {
   *     id: 155,
   *     title: "The Dark Knight",
   *     release_date: "2008-07-18",
   *     poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
   *     genres: [{id: 28, name: "Action"}, {id: 80, name: "Crime"}],
   *     overview: "Batman raises the stakes in his war on crime...",
   *     credits: {
   *       crew: [...],
   *       cast: [...]
   *     },
   *     genres: [{
   *       id: 28,
   *       name: "Action"
   *     }],
   *     similar_movies: {
   *       results: [{
   *         id: 272,
   *         title: "Batman Begins",
   *         poster_path: "/zfVFOo2XCHbeA0mXbst42TAGhfC.jpg",
   *         vote_average: 7,
   *         vote_count: 2492
   *       }]
   *     },
   *     imdb_id: "tt0468569"
   *   }
   * }
   */
  mixins: [Cosmos.mixins.DataFetch,
           Cosmos.mixins.PersistState],
  render: function() {
    if (_.isEmpty(this.state.data)) {
      return (<div className="movie"></div>);
    }
    return (
      <div className="movie">
        <Cosmos component="MovieHeader"
                title={this.state.data.title}
                year={this.getReleaseYear(this.state.data.release_date)}
                posterPath={App.getImagePath(this.state.data.poster_path, 342)}
                credits={App.groupCreditsPerDepartments(this.state.data.credits)} />
        <p className="overview">
          <strong>{this.getGenreNames(this.state.data.genres)}</strong>
          <em>{' --- ' + this.state.data.overview}</em>
        </p>
        <div className="related">
          <p className="related-headline">
            If you liked <em>{this.state.data.title}</em> you might also like...
          </p>
          <Cosmos component="List"
                  state={{data: this.getPropsForRelatedComponent()}} />
        </div>
      </div>
    );
  },
  getDataUrl: function(props) {
    return App.getApiPath('movie', props.id, 'credits,similar_movies');
  },
  getReleaseYear: function(releaseDate) {
    return new Date(releaseDate).getFullYear();
  },
  getGenreNames: function(genres) {
    return _.pluck(genres, 'name').join(', ');
  },
  getPropsForRelatedComponent: function() {
    return _.map(this.getSimilarMovies(), function(movie) {
      return {
        component: "Thumbnail",
        name: movie.title + ' (' + this.getReleaseYear(movie.release_date) + ')',
        image: App.getImagePath(movie.poster_path, 154),
        linkProps: {
          component: "Movie",
          id: movie.id
        }
      };
    }.bind(this));
  },
  getSimilarMovies: function() {
    if (_.isEmpty(this.state.data)) {
      return [];
    }
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
    // Limit similar movies to max 12 items
    movies = movies.slice(0, 12);
    return movies;
  }
});
