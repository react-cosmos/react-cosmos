module.exports = function(props) {
  var title = 'React Component Playground';

  // Set document title to the name of the selected fixture
  if (props.selectedComponent && props.selectedFixture) {
    title = props.selectedComponent + ':' +
            props.selectedFixture + ' – ' +
            title;
  }

  return title;
};
