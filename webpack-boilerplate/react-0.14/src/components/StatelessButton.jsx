var React = require('react');

require('./SimpleButton.css');

var StatelessButton = (props) =>
  <button type="button"
          disabled={props.disabled}
          className="SimpleButton">
    {props.clicks == 0 ? 'Click and let click' :
         props.clicks === 1 ? 'Clicked once' :
             'Clicked ' + props.clicks + ' times'}
  </button>;

StatelessButton.defaultProps = {
  clicks: 0
};

module.exports = StatelessButton;
