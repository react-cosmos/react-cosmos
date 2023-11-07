import Link from 'next/link';
import { useData } from 'nextra/data';
import { useStargazersCount } from '../utils/stargazers';
import styles from './Homepage.module.css';

type StaticProps = {
  version: string;
  stars: number;
};

export function Homepage() {
  const { version, stars: initialStars } = useData() as StaticProps;
  const stars = useStargazersCount(initialStars);
  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={styles.heroTiles}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            A better way to <br className="sm:hidden" />
            build <br className="hidden sm:block" />
            React user <br className="sm:hidden" />
            interfaces.
          </h1>
          <p className={styles.subtitle}>
            React Cosmos is a sandbox for developing and testing UI components
            in isolation. <br className="hidden lg:block" />
            It&apos;s fast, extendable and easy to install.{' '}
            <span className="whitespace-nowrap">Our users love it.</span>
          </p>
          <div className={styles.headerActions}>
            <Link className={styles.cta} href="/docs">
              Get started <span>→</span>
            </Link>
            <a
              className={styles.secondaryButton}
              href="https://reactcosmos.org/demo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
          </div>
          {/* <div>
              <a
                className={styles.cta}
                href="https://github.com/react-cosmos/react-cosmos"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub {stars}
              </a>
              <a
                className={styles.cta}
                href="https://github.com/react-cosmos/react-cosmos/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                v{version}
              </a>
            </div> */}
        </div>
      </div>
      <div className={styles.content}>
        <a
          href="https://reactcosmos.org/demo/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.demoLink}
        >
          <img src="/demo.png" className={styles.demo} />
        </a>
        <div style={{ height: 142 }} />
      </div>
    </div>
  );
}
