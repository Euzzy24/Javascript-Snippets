import { useEffect, useState } from 'react';

// Id of the section in the reading band (30%–40% down the screen).
// Starts as null and keeps the last section while none is in the band.
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(',');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) setActive(en.target.id);
      }
    }, { rootMargin: '-30% 0px -60% 0px' });
    for (const id of key.split(',')) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
