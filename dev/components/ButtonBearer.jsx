let React = require('react'),
  SimpleButton = require('./SimpleButton.jsx');

export default class ButtonBearers extends React.Component {
  render() {
    return <p>I bear a simple button <SimpleButton ref="button" /></p>;
  }
}
