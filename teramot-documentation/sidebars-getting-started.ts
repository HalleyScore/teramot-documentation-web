import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  gettingStartedSidebar: [
    {
      type: 'doc',
      id: 'index', // Esto apunta a getting-started/index.md
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'connect-your-data',
      label: 'Connect Your Data Source',
    },
    {
      type: 'doc',
      id: 'aws-bucket-setup',
      label: 'Create an AWS S3 Bucket',
    },
    {
      type: 'doc',
      id: 'multi-tenant-deployment',
      label: 'Multi-Tenant Deployment',
    },
    {
      type: 'doc',
      id: 'poc-guide',
      label: 'Prepare a Proof of Concept',
    },
    {
      type: 'doc',
      id: 'model-deployment',
      label: 'Deploy Teramot Models',
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
  ],
};

export default sidebars;
