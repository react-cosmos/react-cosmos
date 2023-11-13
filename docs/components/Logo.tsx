import styles from './Logo.module.css';
import Cosmonaut from './svg/cosmonaut.svg';

export function Logo() {
  return (
    <div className={styles.root}>
      <Cosmonaut className={styles.logoSvg} />
      {/* <div className={styles.logoImg} /> */}
      <div className={styles.separator} />
      <span className={styles.title}>React Cosmos</span>
    </div>
  );
}
