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
  initialData: {
    credits: {
      crew: [],
      cast: []
    },
    genres: [],
    similar_movies: {
      results: []
    }
  },
  render: function() {
    return (
      <div>
        <Cosmos component="MovieHeader"
                title={this.state.data.title || ''}
                year={App.getReleaseYear(this.state.data.release_date)}
                posterPath={App.getImagePath(this.state.data.poster_path, 342)}
                credits={App.groupCreditsPerDepartments(this.state.data.credits)} />
        <p className="overview">
          <strong>{App.getGenreNames(this.state.data.genres)}</strong>
          <em>{this.getMovieOverview(this.state.data.overview)}</em>
        </p>
        <div className="related">
          {this.state.data.similar_movies.results.length ?
            <p>If you liked <em>{this.state.data.title}</em>
               you might also like...</p> : ''}
          <Cosmos component="List"
                  state={{data: this.getPropsForSimilarMoviesList(
                                  this.state.data.similar_movies.results)}} />
        </div>
      </div>
    );
  },
  getDataUrl: function(props) {
    return App.getApiPath('movie', props.id, 'credits,similar_movies');
  },
  getMovieOverview: function(overview) {
    return overview ? ' — ' + App.getTextExcerpt(overview, 1000) : '';
  },
  getPropsForSimilarMoviesList: function(movies) {
    var similarMovies = this.filterSimilarMovies(movies);
    return _.map(similarMovies, function(movie) {
      return {
        component: "Thumbnail",
        name: movie.title + ' (' + App.getReleaseYear(movie.release_date) + ')',
        image: App.getImagePath(movie.poster_path, 154),
        linkProps: {
          component: "Movie",
          id: movie.id
        }
      };
    }.bind(this));
  },
  filterSimilarMovies: function(movies) {
    // Can't show thumbnails without images
    movies = _.filter(movies, function(movie) {
      return !!movie.poster_path;
    });
    // Remove unknown or bad movies
    movies = _.filter(movies, function(movie) {
      return movie.vote_count >= 5 && movie.vote_average >= 5;
    });
    // Sort them by vote_average, descending
    movies = _.sortBy(movies, function(movie) {
      return -movie.vote_average;
    });
    return movies;
  }
});
