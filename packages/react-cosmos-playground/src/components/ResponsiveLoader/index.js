// @flow

import React from 'react';
import Header from './Header';

import styles from './index.less';

type Props = {
  inputRef: (node: ?HTMLElement) => void,
  src: string,
  showResponsiveControls: boolean,
  onFixtureUpdate: any,
  devices: Array<{| label: string, width: number, height: number |}>,
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
      devices,
      showResponsiveControls,
      onFixtureUpdate,
      fixture
    } = this.props;
    if (!showResponsiveControls) {
      return <iframe ref={inputRef} src={src} />;
    }
    const { viewport = {} } = fixture;
    const width = viewport.width === 0 || viewport.width ? viewport.width : 320;
    const height =
      viewport.height === 0 || viewport.height ? viewport.height : 568;
    const scale = true;

    const { containerWidth, containerHeight } = this.state;
    const scaleWidth = Math.min(1, containerWidth / width);
    const scaleHeight = Math.min(1, containerHeight / height);
    const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    return (
      <div className={styles.container}>
        <Header
          devices={devices}
          onFixtureUpdate={onFixtureUpdate}
          dimensions={{ width, height, scale }}
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
              className={styles.innerWrapper + ' ' + styles.loaderFrame}
              style={{
                borderWidth: BORDER_WIDTH,
                width: width + 2 * BORDER_WIDTH,
                height: height + 2 * BORDER_WIDTH,
                alignSelf: scaleHeight === 1 ? 'center' : 'flex-start',
                justifySelf: scaleWidth === 1 ? 'center' : 'flex-start',
                transform: `scale( ${scaleFactor} )`
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
