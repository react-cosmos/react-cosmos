Fresh.mixins.UrlRouter = {
  goToLink: function(e) {
    e.preventDefault();
    Fresh.router.goTo(e.currentTarget.getAttribute('href'));
  }
};
