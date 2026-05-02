import { Rocket } from './Rocket';
import styles from './Benefits.module.css';

export function Benefits() {
  return (
    <div className={styles.root}>
      <ul className={styles.benefits}>
        <li className={styles.text}>
          Prototype quickly, debug easily
          <br />
          and maintain quality at scale.
        </li>
        <li className={styles.icon}>
          <Rocket />
        </li>
        <li className={styles.text}>
          Stay organized with a well-
          <br />
          designed component library.
        </li>
      </ul>
    </div>
  );
}
