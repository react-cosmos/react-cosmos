// @flow

import React from 'react';
import Header from './Header';

import styles from './index.less';

type Props = {
  inputRef: (node: ?HTMLElement) => void,
  src: string,
  showResponsiveControls: boolean,
  onFixtureUpdate: any,
  fixture: Object
};

type State = {
  containerWidth: number,
  containerHeight: number
};

const PADDING = 16;
const BORDER_WIDTH = 2;

class ResponsiveLoader extends React.Component<Props, State> {
  state = { containerWidth: 10000, containerHeight: 10000 };
  scalableDiv: ?HTMLElement;

  componentDidMount() {
    window.addEventListener('resize', this.updateContainerWidth);
    setTimeout(this.updateContainerWidth, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateContainerWidth);
  }

  updateContainerWidth = () => {
    if (!this.scalableDiv) {
      return;
    }
    const nextContainerWidth = this.scalableDiv.getBoundingClientRect().width;
    const nextContainerHeight = this.scalableDiv.getBoundingClientRect().height;
    if (
      nextContainerWidth !== this.state.containerWidth ||
      nextContainerHeight !== this.state.containerHeight
    ) {
      this.setState({
        containerWidth: nextContainerWidth - 2 * (PADDING + BORDER_WIDTH),
        containerHeight: nextContainerHeight - 2 * (PADDING + BORDER_WIDTH)
      });
    }
  };

  render() {
    const {
      inputRef,
      src,
      showResponsiveControls,
      onFixtureUpdate,
      fixture
    } = this.props;
    if (!showResponsiveControls) {
      return <iframe ref={inputRef} src={src} />;
    }
    const { width = 320, height = 568 } = fixture;
    const { containerWidth, containerHeight } = this.state;
    const scaleWidth = Math.min(1, containerWidth / width);
    const scaleHeight = Math.min(1, containerHeight / height);
    const scale = Math.min(scaleWidth, scaleHeight);
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    return (
      <div className={styles.container}>
        <Header
          onFixtureUpdate={onFixtureUpdate}
          fixture={fixture}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
        <div
          className={styles.outerWrapper}
          ref={el => {
            this.scalableDiv = el;
          }}
          style={{ padding: PADDING }}
        >
          <div
            style={{
              lineHeight: 0,
              width: scaledWidth + 2 * BORDER_WIDTH,
              height: scaledHeight + 2 * BORDER_WIDTH
            }}
          >
            <div
              className={styles.innerWrapper}
              style={{
                borderWidth: BORDER_WIDTH,
                width: width + 2 * BORDER_WIDTH,
                height: height + 2 * BORDER_WIDTH,
                alignSelf: scaleHeight === 1 ? 'center' : 'flex-start',
                justifySelf: scaleWidth === 1 ? 'center' : 'flex-start',
                transform: `scale( ${scale} )`
              }}
            >
              <iframe
                ref={inputRef}
                src={src}
                frameBorder={0}
                allowTransparency="true"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ResponsiveLoader;
