import { Footer } from './components/Footer.tsx';
import { Logo } from './components/Logo.tsx';

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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
