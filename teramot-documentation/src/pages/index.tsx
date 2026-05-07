import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBg} />
      <div className="container">
        <div className={styles.logoWrapper}>
          <img
            src="/img/index/logo-dark.png"
            className={clsx(styles.logoImage, styles.logoImageLight)}
            alt="Teramot Logo"
          />
          <img
            src="/img/index/logo-light.png"
            className={clsx(styles.logoImage, styles.logoImageDark)}
            alt="Teramot Logo"
          />
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          Welcome to Teramot Documentation
        </Heading>
        <p className={styles.heroSubtitle}>
          Documentation, integration guides and API reference for scaling AI Agents with Teramot.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/getting-started/getting-started">
            Get Started
          </Link>
          <Link className="button button--secondary button--lg" to="/api/intro">
            API Reference
          </Link>
          <Link className="button button--secondary button--lg" to="/updates">
            Product Updates
          </Link>

        </div>
      </div>
    </header>
  );
}

interface DocumentationSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

function DocumentationSection({title, description, imageUrl, buttonText, buttonLink}: DocumentationSectionProps) {
  return (
    <div className={styles.docSection}>
      <div className={styles.docSectionImage}>
        <img src={imageUrl} alt={title} />
      </div>
      <div className={styles.docSectionContent}>
        <Heading as="h3" className={styles.docSectionTitle}>{title}</Heading>
        <p className={styles.docSectionDescription}>{description}</p>
        <Link className="button button--primary" to={buttonLink}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

function DocumentationSections() {
  const sections: DocumentationSectionProps[] = [
    {
      title: "Getting Started",
      description: "Start integrating your corporate data into Teramot Agents. Step-by-step tutorials for connecting AWS, building your medallion architecture, and unlocking the Gold Layer.",
      imageUrl: "/img/index/Chat bot-pana.svg",
      buttonText: "Go to Getting Started",
      buttonLink: "/getting-started/getting-started"
    },
    {
      title: "API Reference",
      description: "Full technical documentation for our AI Agent APIs. Query, operate and automate on the Gold Layer—securely, reliably, and at scale.",
      imageUrl: "/img/index/Data extraction-rafiki.svg",
      buttonText: "Go to API Reference",
      buttonLink: "/api/intro"
    },
    {
      title: "Compliance",
      description: "Access all compliance documentation: ISO 27001, SOC2, GDPR and more. Security standards, audit details, and best practices.",
      imageUrl: "/img/index/Secure Server-cuate.svg",
      buttonText: "Go to Compliance",
      buttonLink: "/compliance/about"
    },
    {
      title: "Product Updates",
      description: "Read the latest changelogs, feature releases, and technical improvements across the Teramot platform.",
      imageUrl: "/img/index/Business-Plan-amico.svg",
      buttonText: "Go to Product Updates",
      buttonLink: "/updates"
    },
    {
      title: "Service Status",
      description: "Check real-time operational status for Teramot services, APIs and infrastructure.",
      imageUrl: "/img/index/Data-extraction-bro.svg",
      buttonText: "Go to Service Status",
      buttonLink: "/status/intro"
    }
  ];

  return (
    <section className={styles.docSections}>
      <div className="container">
        <div className={styles.docSectionsGrid}>
          {sections.map((section, idx) => (
            <DocumentationSection key={idx} {...section} />
          ))}
</div>
</div>

<div style={{ textAlign: 'center', marginTop: '3rem' }}>
  <Link
    to="/help"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#888',
      fontSize: '0.95rem',
      textDecoration: 'none',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = '#aaa')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = '#ccc')}
  >
    🛟 Need help? Visit the Help Center
  </Link>

</div>

<div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
  <Link
    to="/terms"
    style={{ color: 'var(--ifm-color-emphasis-500)', fontSize: '0.82rem', textDecoration: 'none', cursor: 'pointer' }}
  >
    Terms of Service
  </Link>
  <span style={{ color: 'var(--ifm-color-emphasis-300)', fontSize: '0.82rem' }}>·</span>
  <Link
    to="/privacy"
    style={{ color: 'var(--ifm-color-emphasis-500)', fontSize: '0.82rem', textDecoration: 'none', cursor: 'pointer' }}
  >
    Privacy Policy
  </Link>
</div>

    </section>
  );
}


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation, integration guides and API reference for scaling AI Agents with Teramot">
      <HomepageHeader />
      <main>
        <DocumentationSections />
      </main>
    </Layout>
  );
}
