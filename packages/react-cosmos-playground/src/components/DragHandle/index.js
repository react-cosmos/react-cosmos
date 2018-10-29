import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

class DragHandle extends Component {
  state = {
    isDragging: false,
    offset: 0
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
    e.preventDefault();

    const { rootNode } = this;
    const { clientX, clientY } = e;
    const offset = this.props.vertical
      ? rootNode.offsetTop + rootNode.offsetHeight - clientY
      : rootNode.offsetLeft + rootNode.offsetWidth - clientX;

    this.setState(
      {
        isDragging: true,
        offset
      },
      this.props.onDragStart
    );
  };

  onMouseMove = e => {
    const { vertical, onDrag } = this.props;
    const { isDragging, offset } = this.state;
    const { clientX, clientY } = e;

    if (isDragging) {
      const val = vertical ? clientY : clientX;
      onDrag(val + offset);
    }
  };

  onMouseUp = () => {
    if (!this.state.isDragging) {
      return;
    }

    this.setState(
      {
        isDragging: false
      },
      this.props.onDragEnd
    );
  };

  render() {
    const { vertical } = this.props;

    const className = classNames(styles.root, {
      [styles.vertical]: vertical,
      [styles.horizontal]: !vertical
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
  onDrag: func.isRequired,
  onDragStart: func,
  onDragEnd: func
};

DragHandle.defaultProps = {
  vertical: false,
  onDragStart: () => {},
  onDragEnd: () => {}
};

export default DragHandle;
