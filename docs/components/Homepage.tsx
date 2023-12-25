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
        <ul className={styles.features}>
          <li>
            <strong>Fixtures.</strong> File-system based module convention for
            defining component states effortlessly.
          </li>
          <li>
            <strong>User Interface.</strong> User-friendly interface for
            browsing fixtures with responsive viewports.
          </li>
          <li>
            <strong>Control Panel.</strong> Component data manipulation through
            UI controls for props and state.
          </li>
          <li>
            <strong>Static Export.</strong> Interactive component library
            deployable to any static hosting service.
          </li>
          <li>
            <strong>Integration.</strong> Vite, Webpack, React Native, Next.js,
            and support for integrating custom setups.
          </li>
          <li>
            <strong>Plugins.</strong> Full-stack plugin system for extending
            every aspect of React Cosmos.
          </li>
          <li>
            <strong>High Quality.</strong> TypeScript. Minimal deps.
            Meticulously designed and tested for the best DX.
          </li>
        </ul>
        <HomepageLogos />
      </div>
    </div>
  );
}
