import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

// TODO: Add tests for onChange callback
class DragHandle extends Component {
  state = {
    isDragging: false,
    offset: 0,
  };

  componentDidMount() {
    this.rootNode.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    this.rootNode.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = e => {
    const { clientX, clientY } = e;
    const offset = this.props.vertical
      ? clientY - this.rootNode.offsetTop
      : clientX - this.rootNode.offsetLeft;

    this.setState({
      isDragging: true,
      offset,
    });
  };

  onMouseMove = e => {
    const { vertical, onChange } = this.props;
    const { isDragging, offset } = this.state;
    const { clientX, clientY } = e;

    if (isDragging) {
      const val = vertical ? clientY : clientX;
      onChange(val - offset);
    }
  };

  onMouseUp = () => {
    this.setState({
      isDragging: false,
    });
  };

  render() {
    const { vertical } = this.props;

    const className = classNames(styles.root, {
      [styles.vertical]: vertical,
      [styles.horizontal]: !vertical,
    });
    return (
      <div
        className={className}
        ref={node => {
          this.rootNode = node;
        }}
      />
    );
  }
}

DragHandle.propTypes = {
  vertical: bool,
  onChange: func,
};

export default DragHandle;
