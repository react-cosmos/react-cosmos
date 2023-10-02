import React from 'react';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <div className={styles.root}>
      <img
        src="/helmet/helmet-cropped-white.png"
        alt=""
        className={styles.img}
      />
      <div className={styles.separator} />
      <span className={styles.title}>React Cosmos</span>
    </div>
  );
}
