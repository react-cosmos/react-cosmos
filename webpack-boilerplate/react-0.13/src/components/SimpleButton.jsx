var React = require('react');

require('./SimpleButton.css');

class SimpleButton extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.state = {
      clicks: 0
    };
  }
  render() {
    return <button type="button"
                   disabled={this.props.disabled}
                   className="SimpleButton"
                   onClick={this.onClick}>
      {this.state.clicks == 0 ? 'Click and let click' :
           this.state.clicks === 1 ? 'Clicked once' :
               'Clicked ' + this.state.clicks + ' times'}
    </button>;
  }
  onClick() {
    this.setState({clicks: ++this.state.clicks});
  }
}

module.exports = SimpleButton;
