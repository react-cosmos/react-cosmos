import Link from 'next/link';
import { useStargazersCount } from '../utils/useStargazersCount';
import styles from './HomepageHero.module.css';

type Props = {
  version: string;
  stars: number;
};
export function HomepageHero({ version, stars: initialStars }: Props) {
  const stars = useStargazersCount(initialStars);
  const preRelease = version.includes('-');
  return (
    <div className={styles.root}>
      <div className={styles.tilesBg}></div>
      <div className={styles.tiles}></div>
      <div className={styles.content}>
        <div className={styles.badgeContainer}>
          <Link className={styles.badge} href="/docs/getting-started">
            Ready for React 19 and Next 15 🐣
          </Link>
        </div>
        <h1 className={styles.headline}>
          A better way to <br className="sm:hidden" />
          build <br className="hidden sm:block" />
          React user <br className="sm:hidden" />
          interfaces.
        </h1>
        <p className={styles.subtitle}>
          React Cosmos is a sandbox for developing and testing UI components in
          isolation. <br />
          It&apos;s fast, extendable and easy to install.{' '}
          <span className="whitespace-nowrap">Our users love it.</span>
        </p>
        <div className={styles.actions}>
          <Link className={styles.cta} href="/docs/getting-started">
            Get started <span>→</span>
          </Link>
          <a
            className={styles.secondaryAction}
            href="https://reactcosmos.org/demo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live demo
          </a>
        </div>
        <div className={styles.links}>
          <a
            href="https://github.com/react-cosmos/react-cosmos"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <strong>☆{stars}</strong>
          </a>
          <a
            href={`https://github.com/react-cosmos/react-cosmos/${preRelease ? 'tags' : 'releases'}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Version <strong>{version}</strong>
          </a>
        </div>
      </div>
    </div>
  );
}
