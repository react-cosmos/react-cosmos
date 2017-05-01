import React from 'react';
import CosmosImg from '../static/cosmos.png';
import StarryBackground from './starry-background';

const style = require('./display-screen.less');

const Template = ({ children }) => (
  <div className={style['display-screen']}>
    <StarryBackground />
    <div className={style['display-screen-inner']}>
      <img src={CosmosImg} />
      <div>{children}</div>
    </div>
  </div>
);

export default Template;
