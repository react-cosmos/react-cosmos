import { ReactNode } from 'react';
import styles from './Benefits.module.css';

export function Benefits() {
  return (
    <div className={styles.root}>
      <ul className={styles.benefits}>
        <li>Prototype quickly, debug easily and maintain quality at scale.</li>
        <li>Stay organized with a well-designed component library.</li>
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
