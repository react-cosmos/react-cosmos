var React = require('react'),
    ButtonBearer = require('./ButtonBearer.jsx');

class ButtonBearers extends React.Component {
  render() {
    var bearers = [];
    for (var i = 0; i < this.props.count; i++) {
      bearers.push(React.createElement(ButtonBearer, {
        key: i,
        ref: 'bearer' + i
      }));
    }
    return React.DOM.div({}, bearers);
  }
}

ButtonBearers.propTypes = {
  count: React.PropTypes.number.isRequired
};

module.exports = ButtonBearers;
