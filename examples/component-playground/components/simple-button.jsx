var React = require('react');

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
