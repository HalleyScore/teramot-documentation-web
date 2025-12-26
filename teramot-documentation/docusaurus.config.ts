import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Teramot Documentation',
  tagline: 'Technical documentation, compliance materials, and product updates for Teramot',
  favicon: '/img/index/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.teramot.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'teramot', // Usually your GitHub org/user name.
  projectName: 'teramot-documentation', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars-api.ts',
          routeBasePath: '/api',
        },
        // ✅ mantené blog y theme si los usás
        blog: {
          routeBasePath: '/updates',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          blogTitle: 'Product Updates',
          blogDescription: 'Latest product updates, feature releases, and platform improvements',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],


  // Multiple documentation sections
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'getting-started',
        path: 'getting-started',
        routeBasePath: '/getting-started',
        sidebarPath: require.resolve('./sidebars-getting-started.ts'),
        // TODO: Update with actual repo URL when ready
        // editUrl: 'https://github.com/teramot/teramot-documentation/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'compliance',
        path: 'compliance',
        routeBasePath: '/compliance',
        sidebarPath: require.resolve('./sidebars-compliance.ts'),
        // TODO: Update with actual repo URL when ready
        // editUrl: 'https://github.com/teramot/teramot-documentation/tree/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'status',
        path: 'status',
        routeBasePath: '/status',
        sidebarPath: require.resolve('./sidebars-status.ts'),
        // TODO: Update with actual repo URL when ready
        // editUrl: 'https://github.com/teramot/teramot-documentation/tree/main/',
      },
    ],
  ],

  themeConfig: {
    // TODO: Replace with Teramot social card image
    image: 'img/index/logo.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
      disableSwitch: false,
    },
    navbar: {
      title: 'Teramot Docs',
      logo: {
        alt: 'Teramot Logo',
        src: 'img/index/logo.png',
      },
      items: [
        {
          to: '/getting-started/getting-started',
          position: 'left',
          label: 'Getting Started',
        },
        {
          to: '/api/intro',
          position: 'left',
          label: 'API',
        },
        {
          to: '/compliance/about',
          position: 'left',
          label: 'Compliance',
        },
        { to: '/updates', label: 'Updates', position: 'left' },
        {
          to: '/status/intro',
          position: 'left',
          label: 'Status',
        },
        {
          href: 'https://teramot.com',
          label: 'Teramot.com',
          position: 'right',
        },

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'API Reference',
              to: '/api/intro',
            },
            {
              label: 'Getting Started',
              to: '/getting-started/getting-started',
            },
            {
              label: 'Compliance',
              to: '/compliance/about',
            },

          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Product Updates',
              to: '/updates',
            },
            {
              label: 'System Status',
              to: '/status/intro',
            },
            {
              label: 'Help Center',
              to: '/help',
            },
          ],
        },
        {
          title: 'Teramot',
          items: [
            {
              label: 'About Us',
              to: 'https://teramot.com/',
            },
            {
              label: 'Privacy Policy',
              to: '/compliance/transparency/privacy-policy',
            },
          ],
        },

      ],
      copyright: `© ${new Date().getFullYear()} Teramot, Inc. All rights reserved.`,
      logo: {
        alt: 'Teramot Logo',
        src: '/img/index/logo-light.png',
        href: 'https://teramot.com',
        width: 400,
      },
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
