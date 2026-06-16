import React, {type ReactNode} from 'react';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import type LocaleDropdownNavbarItemType from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = WrapperProps<typeof LocaleDropdownNavbarItemType>;

// Spanish is only available for the API docs, so the language toggle should only
// appear on /api routes. Everywhere else the rest of the site is English-only.
export default function LocaleDropdownNavbarItemWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const {i18n} = useDocusaurusContext();

  // Strip any non-default locale prefix (e.g. "/es") so detection works in both locales.
  const prefixes = i18n.locales
    .filter((l) => l !== i18n.defaultLocale)
    .map((l) => `/${l}`);
  let path = pathname;
  for (const p of prefixes) {
    if (path === p || path.startsWith(`${p}/`)) {
      path = path.slice(p.length) || '/';
      break;
    }
  }

  const isApi = path === '/api' || path.startsWith('/api/');
  if (!isApi) {
    return null;
  }
  return <LocaleDropdownNavbarItem {...props} />;
}
