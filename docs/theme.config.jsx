import { useRouter } from 'next/router';
import { Footer } from './components/Footer.tsx';
import { Logo } from './components/Logo.tsx';
import { NavbarWrapper } from './components/NavbarWrapper.tsx';

export default {
  docsRepositoryBase:
    'https://github.com/react-cosmos/react-cosmos/blob/main/docs',
  logo: () => <Logo />,
  feedback: { content: null },
  project: {
    link: 'https://github.com/react-cosmos/react-cosmos',
  },
  chat: {
    link: 'https://discord.gg/3X95VgfnW5',
  },
  head: () => {
    // https://nextra.site/docs/docs-theme/theme-configuration#dynamic-tags-based-on-page
    // prettier-ignore
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48" />
        <link rel="apple-touch-icon"  href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="description" content="Sandbox for developing and testing UI components in isolation." />
        <meta property="og:title" content="React Cosmos" />
        <meta property="og:description" content="Sandbox for developing and testing UI components in isolation." />
        <meta property="og:url" content="https://reactcosmos.org" />
        <meta property="og:image" content="https://reactcosmos.org/og-slogan.png" />
        <meta name="twitter:title" content="React Cosmos" />
        <meta name="twitter:description" content="Sandbox for developing and testing UI components in isolation." />
        <meta name="twitter:site" content="@ReactCosmos" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://reactcosmos.org/og-slogan.png" />
      </>
    );
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  gitTimestamp: null,
  navbar: {
    component: NavbarWrapper,
  },
  footer: {
    text: <Footer />,
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    return {
      titleTemplate: asPath !== '/' ? '%s – React Cosmos' : 'React Cosmos',
    };
  },
};
