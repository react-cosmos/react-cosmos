import { func, object } from 'prop-types';
import React, { Component } from 'react';
import CodeMirror from '@skidding/react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/theme/solarized.css';
import styles from './index.less';

const stringify = value => JSON.stringify(value, null, 2);

class FixtureEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: stringify(props.value),
      isFocused: false,
      error: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.isFocused &&
      stringify(nextProps.value) !== stringify(this.props.value)
    ) {
      this.setState({
        userInput: stringify(nextProps.value),
        error: null,
      });
    }
  }

  handleChange = userInput => {
    const { onChange } = this.props;

    try {
      // Treat the empty editor as '{}'
      onChange(userInput ? JSON.parse(userInput) : {});

      this.setState({
        error: null,
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  };

  handleFocusChange = isFocused => {
    this.setState({ isFocused });
  };

  handleKeyDown = e => {
    // Prevent editor key events from reaching other components (E.g. Fixture
    // list search mustn't be triggered when typing "s" inside the editor)
    e.stopPropagation();
  };

  render() {
    const { userInput, error } = this.state;

    return (
      <div className={styles.root} onKeyDown={this.handleKeyDown}>
        <CodeMirror
          value={userInput}
          preserveScrollPosition
          onChange={this.handleChange}
          onFocusChange={this.handleFocusChange}
          options={{
            mode: 'javascript',
            foldGutter: true,
            lineNumbers: true,
            theme: 'solarized light',
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          }}
        />
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }
}

FixtureEditor.propTypes = {
  value: object,
  onChange: func,
};

export default FixtureEditor;
