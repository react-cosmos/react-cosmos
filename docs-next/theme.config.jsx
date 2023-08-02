import { useRouter } from 'next/router';
import React from 'react';

export default {
  docsRepositoryBase:
    'https://github.com/react-cosmos/react-cosmos/blob/main/docs',
  logo: <span>React Cosmos</span>,
  project: {
    link: 'https://github.com/react-cosmos/react-cosmos',
  },
  // chat: {
  //   link: 'https://discord.gg/3X95VgfnW5',
  // },
  head: () => {
    // https://nextra.site/docs/docs-theme/theme-configuration#dynamic-tags-based-on-page
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </>
    );
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://reactcosmos.org" target="_blank" rel="noreferrer">
          React Cosmos
        </a>
        .
      </span>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    return {
      titleTemplate: asPath !== '/' ? '%s – React Cosmos' : 'React Cosmos',
    };
  },
};
