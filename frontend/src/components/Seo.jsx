import { useEffect } from 'react';

export function Seo({ title, description }) {
  const siteTitle = 'Zaika Restaurant';

  useEffect(() => {
    document.title = title ? `${title} | ${siteTitle}` : siteTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }

    if (description) {
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
