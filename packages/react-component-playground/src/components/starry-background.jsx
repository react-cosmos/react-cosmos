import React, { Component } from 'react';

const style = require('./display-screen.less');

class StarryBackground extends Component {
  render() {
    return (
      <div className={style['starry-background']}>
        <div className={style.stars}></div>
        <div className={style.twinkling}></div>
        <div className={style.clouds}></div>
      </div>
    );
  }
}

export default StarryBackground;
