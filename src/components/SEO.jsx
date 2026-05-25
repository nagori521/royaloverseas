import { useEffect } from 'react';

export default function SEO({
  title = 'Royal Overseas | Premium Import Export Company',
  description = 'Royal Overseas exports rice, spices, detergent and packaged products worldwide.',
}) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [description, title]);

  return null;
}
