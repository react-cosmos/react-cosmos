// @flow

import React from 'react';
import Header from './Header';
import classNames from 'classnames';
import localForage from 'localforage';
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
  containerHeight: number,
  savedWidth: ?number,
  savedHeight: ?number,
  scale: boolean
};

const RESPONSIVE_FIXTURE_WIDTH = '__cosmos__responsive-fixture-width';
const RESPONSIVE_FIXTURE_HEIGHT = '__cosmos__respinsive-fixture-height';

const PADDING = 16;
const BORDER_WIDTH = 2;

class ResponsiveLoader extends React.Component<Props, State> {
  state = {
    containerWidth: 10000,
    containerHeight: 10000,
    savedWidth: null,
    savedHeight: null,
    scale: true
  };

  scalableDiv: ?HTMLElement;

  async componentDidMount() {
    window.addEventListener('resize', this.updateContainerDimensions);

    // Wait for window to render before trying to figure out the dimensions
    setTimeout(this.updateContainerDimensions, 1000);

    const [savedWidth, savedHeight] = await Promise.all([
      localForage.getItem(RESPONSIVE_FIXTURE_WIDTH),
      localForage.getItem(RESPONSIVE_FIXTURE_HEIGHT)
    ]);

    this.setState({ savedWidth, savedHeight });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateContainerDimensions);
  }

  updateDimensions = (width: number, height: number) => {
    const { onFixtureUpdate } = this.props;
    localForage.setItem(RESPONSIVE_FIXTURE_WIDTH, width);
    localForage.setItem(RESPONSIVE_FIXTURE_HEIGHT, height);
    onFixtureUpdate({ viewport: { width, height } });
    this.setState({ savedWidth: width, savedHeight: height });
  };

  updateContainerDimensions = () => {
    if (!this.scalableDiv) {
      return;
    }
    const {
      width: nextContainerWidth,
      height: nextContainerHeight
    } = this.scalableDiv.getBoundingClientRect();

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

  setScale = (scale: boolean) => {
    this.setState({ scale });
  };

  render() {
    const {
      inputRef,
      src,
      devices,
      showResponsiveControls,
      fixture
    } = this.props;
    const { scale, savedWidth, savedHeight } = this.state;

    const { viewport = {} } = fixture;
    const width =
      viewport.width === 0 || viewport.width
        ? viewport.width
        : savedWidth || 320;
    const height =
      viewport.height === 0 || viewport.height
        ? viewport.height
        : savedHeight || 568;

    const { containerWidth, containerHeight } = this.state;
    const scaleWidth = Math.min(1, containerWidth / width);
    const scaleHeight = Math.min(1, containerHeight / height);
    const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    // We can't simply say
    // if (!showResponsiveControls) { return <iframe> };
    // because this causes flicker when switching between responsive and
    // non responsive mode as the React component tree is completely different.

    const containerClassName = showResponsiveControls
      ? styles.container
      : styles.nonResponsive;

    const outerWrapperClassName = showResponsiveControls
      ? styles.outerWrapper
      : styles.nonResponsive;

    let outerWrapperStyle = {
      display: !showResponsiveControls || scale ? 'flex' : 'block'
    };
    if (showResponsiveControls) {
      outerWrapperStyle = { ...outerWrapperStyle, padding: PADDING };
    }

    const middleWrapperClassName = showResponsiveControls
      ? ''
      : styles.nonResponsive;
    const middleWrapperStyle = showResponsiveControls
      ? {
          lineHeight: 0,
          width: scaledWidth + 2 * BORDER_WIDTH,
          height: scaledHeight + 2 * BORDER_WIDTH
        }
      : {};

    const innerWrapperClassName = showResponsiveControls
      ? classNames(styles.innerWrapper, styles.checkerboard)
      : classNames(styles.nonResponsive, styles.checkerboard);
    const innerWrapperStyle = showResponsiveControls
      ? {
          borderWidth: BORDER_WIDTH,
          width: width + 2 * BORDER_WIDTH,
          height: height + 2 * BORDER_WIDTH,
          alignSelf: scaleHeight === 1 ? 'center' : 'flex-start',
          justifySelf: scaleWidth === 1 ? 'center' : 'flex-start',
          transform: `scale( ${scaleFactor} )`
        }
      : {};

    return (
      <div className={containerClassName}>
        {showResponsiveControls && (
          <Header
            devices={devices}
            dimensions={{ width, height, scale }}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            updateDimensions={this.updateDimensions}
            setScale={this.setScale}
          />
        )}
        <div
          className={outerWrapperClassName}
          ref={el => (this.scalableDiv = el)}
          style={outerWrapperStyle}
        >
          <div className={middleWrapperClassName} style={middleWrapperStyle}>
            <div className={innerWrapperClassName} style={innerWrapperStyle}>
              <iframe ref={inputRef} src={src} frameBorder={0} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ResponsiveLoader;
