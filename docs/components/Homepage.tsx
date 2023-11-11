import { useData } from 'nextra/data';
import styles from './Homepage.module.css';
import { HomepageHero } from './HomepageHero';
import { HomepageLogos } from './HomepageLogos';

type StaticProps = {
  version: string;
  stars: number;
};

export function Homepage() {
  const { version, stars } = useData() as StaticProps;
  return (
    <div>
      <HomepageHero version={version} stars={stars} />
      <div className={styles.content}>
        <a
          href="https://reactcosmos.org/demo/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.demoPreview}
        >
          <img src="/demo.png" />
        </a>
        <HomepageLogos />
      </div>
    </div>
  );
}
