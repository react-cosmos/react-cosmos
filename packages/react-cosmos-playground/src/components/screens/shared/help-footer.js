import React from 'react';
import style from './DisplayScreen/index.less';

export const helpFooter = (
  <p className={style.faded}>
    If you can't figure it out{' '}
    <a
      target="_blank"
      href="https://github.com/react-cosmos/react-cosmos/issues/new"
    >
      report your error
    </a>{' '}
    and we'll do our best to help. Include as much details as you can.
  </p>
);
