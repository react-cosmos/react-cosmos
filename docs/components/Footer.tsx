import { Link } from 'nextra-theme-docs';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <div className={`${styles.root} lg:flex lg:flex-row-reverse`}>
      <div className={`${styles.columns} lg:w-3/4`}>
        <section>
          <h3>FAQ</h3>
          <ul>
            <li>
              <Link href="/docs#what-is-react-cosmos">
                What is React Cosmos?
              </Link>
            </li>
            <li>
              <Link href="/docs#key-features">Key Features</Link>
            </li>
            <li>
              <Link href="/docs#why-is-react-cosmos-architecturally-unique">
                Architecture
              </Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </section>
        <section>
          <h3>Guides</h3>
          <ul>
            <li>
              <Link href="/docs/getting-started/vite">Vite</Link>
            </li>
            <li>
              <Link href="/docs/getting-started/webpack">Webpack</Link>
            </li>
            <li>
              <Link href="/docs/getting-started/react-native">
                React Native
              </Link>
            </li>
            <li>
              <Link href="/docs/getting-started/next">Next.js</Link>
            </li>
            <li>
              <Link href="/docs/getting-started">All Guides</Link>
            </li>
          </ul>
        </section>
        <section>
          <h3>Usage</h3>
          <ul>
            <li>
              <Link href="/docs/cli">CLI</Link>
            </li>
            <li>
              <Link href="/docs/user-interface">User Interface</Link>
            </li>
            <li>
              <Link href="/docs/fixtures">Fixtures &amp; Decorators</Link>
            </li>
            <li>
              <Link href="/docs/configuration/cosmos-config">
                Configuration
              </Link>
            </li>
            <li>
              <Link href="/docs/plugins">Plugins</Link>
            </li>
          </ul>
        </section>
        <section>
          <h3>Ecosystem</h3>
          <ul>
            <li>
              <Link href="https://github.com/react-cosmos/react-cosmos">
                GitHub ↗
              </Link>
            </li>
            <li>
              <Link href="https://discord.gg/3X95VgfnW5">Discord ↗</Link>
            </li>
            <li>
              <Link href="https://twitter.com/ReactCosmos">Twitter ↗</Link>
            </li>
            <li>
              <Link href="https://github.com/react-cosmos/react-cosmos/discussions">
                Discussions ↗
              </Link>
            </li>
            <li>
              <Link href="https://github.com/sponsors/skidding">
                Sponsor ↗
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <div className="lg:w-1/4">
        © {new Date().getFullYear()} <Link href="/">React Cosmos</Link>.
      </div>
    </div>
  );
}
