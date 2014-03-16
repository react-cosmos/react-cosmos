Cosmos.mixins.ClassName = {
  getClassName: function() {
    var classes = [];
    if (this.defaultClass) {
      classes.push(this.defaultClass);
    }
    if (this.props.class) {
      classes.push(this.props.class);
    }
    return classes.length ? classes.join(' ') : null;
  }
};
