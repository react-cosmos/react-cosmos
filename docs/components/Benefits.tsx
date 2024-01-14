import { ReactNode } from 'react';
import styles from './Benefits.module.css';
import { Rocket } from './Rocket';

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

// Prototype quickly, debug with ease and
// maintain quality at scale.

type FeatureProps = {
  title: string;
  description: string;
  icon: ReactNode;
};
function Feature({ title, description, icon }: FeatureProps) {
  return (
    <li>
      <strong>
        {icon} {title}
      </strong>{' '}
      {description}
    </li>
  );
}
