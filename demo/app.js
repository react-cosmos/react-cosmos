var App = {
  MOVIEDB_API_ROOT: 'http://api.themoviedb.org/3',
  MOVIEDB_IMG_ROOT: 'http://image.tmdb.org/t/p',
  MOVIEDB_API_KEY: '6cca1ecbcf2b6eec3644b802773e6feb',

  getApiPath: function(entity, id, append_to_response) {
    return App.MOVIEDB_API_ROOT +
           '/' + entity + '/' + id +
           '?append_to_response=' + append_to_response +
           '&api_key=' + App.MOVIEDB_API_KEY;
  },
  getImagePath: function(path, size) {
    return App.MOVIEDB_IMG_ROOT + '/w' + size + path;
  },
  getReleaseYear: function(date) {
    return new Date(date).getFullYear();
  },
  getBirthDay: function(date) {
    var date = new Date(date);
    return this.getMonthName(date.getMonth()) + ' ' + date.getDate() + ', ' +
           date.getFullYear();
  },
  getMonthName: function(monthNumber) {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'][monthNumber];
  },
  getGenreNames: function(genres) {
    return _.pluck(genres, 'name').join(', ');
  },
  groupCreditsPerDepartments: function(credits) {
    return {
      directing: this.filterCrewByDepartment(credits.crew, 'Directing'),
      writing: this.filterCrewByDepartment(credits.crew, 'Writing'),
      production: this.filterCrewByDepartment(credits.crew, 'Production'),
      acting: credits.cast
    };
  },
  filterCrewByDepartment: function(crew, department) {
    var filteredCrew = _.filter(crew, function(person) {
      return person.department == department;
    });
    // Remove duplicate entries when a person has more than one role in the
    // same department
    return _.uniq(filteredCrew, false, function(person) {
      return person.id;
    });
  }
};
