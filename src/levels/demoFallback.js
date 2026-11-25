
// Preview only: this page cannot load outside images, so each Unsplash photo
// is swapped for a matching drawing here. Students' copies load the real photos.
(function () {
const svg = (bg, shapes) =>
  'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110"><rect width="160" height="110" fill="${bg}"/>${shapes}</svg>`
  );

  const pictures = {
  '1562217199-6e6d4cd031f5': svg('#ede9fe', `
    <rect x="52" y="16" width="58" height="80" rx="6" fill="#7c3aed"/>
    <rect x="66" y="32" width="32" height="12" rx="2" fill="#fff"/>
    <rect x="66" y="52" width="32" height="3" rx="1.5" fill="#c4b5fd"/>
    <rect x="66" y="60" width="24" height="3" rx="1.5" fill="#c4b5fd"/>
    ${[24, 36, 48, 60, 72, 84].map((y) => `<circle cx="52" cy="${y}" r="4" fill="#fff" stroke="#4c1d95" stroke-width="2"/>`).join('')}`),

  '1567855354833-ac2c4f967b0c': svg('#ffedd5', ['#2563eb', '#dc2626', '#111827', '#16a34a', '#7c3aed'].map((c, i) => `
    <rect x="${50 + i * 13}" y="18" width="9" height="62" rx="3" fill="${c}"/>
    <rect x="${50 + i * 13}" y="18" width="9" height="12" rx="3" fill="#fff" opacity=".35"/>
    <path d="M${50 + i * 13} 80 h9 l-4.5 14 z" fill="#e5e7eb"/>`).join('')),

  '1544003484-3cd181d17917': svg('#dcfce7', `
    <rect x="61" y="14" width="38" height="10" rx="4" fill="#1f2937"/>
    <path d="M58 26 H102 L96 94 Q80 100 64 94 Z" fill="#22a06b"/>
    <rect x="60" y="48" width="40" height="12" fill="#fff" opacity=".85"/>
    <path d="M66 30 L70 90" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".35"/>`),

  '1581068466660-e6585b8afa97': svg('#e0e7ff', `
    <rect x="34" y="40" width="70" height="32" rx="9" fill="#6366f1"/>
    <circle cx="46" cy="56" r="5" fill="#e0e7ff"/>
    <rect x="104" y="45" width="24" height="22" rx="2" fill="#cbd5e1"/>
    <rect x="112" y="50" width="6" height="5" fill="#64748b"/>
    <rect x="112" y="58" width="6" height="5" fill="#64748b"/>
    <text x="76" y="61" font-family="Arial" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">32GB</text>`),

  '1683739147682-607fb8e24e3f': svg('#fef9c3', `
    <rect x="40" y="30" width="46" height="46" rx="3" fill="#f472b6" transform="rotate(-8 63 53)"/>
    <rect x="62" y="26" width="46" height="46" rx="3" fill="#facc15" transform="rotate(6 85 49)"/>
    <rect x="76" y="44" width="46" height="46" rx="3" fill="#60a5fa" transform="rotate(-3 99 67)"/>
    <rect x="84" y="56" width="28" height="3" rx="1.5" fill="#1e3a8a" opacity=".4"/>
    <rect x="84" y="64" width="20" height="3" rx="1.5" fill="#1e3a8a" opacity=".4"/>`),

  '1555679792-6783ef0bbf61': svg('#e2e8f0', `
    <path d="M56 36 Q58 70 80 78 Q102 70 104 36" fill="none" stroke="#334155" stroke-width="3"/>
    <path d="M80 78 V96" stroke="#334155" stroke-width="3"/>
    <rect x="76" y="94" width="8" height="10" rx="2" fill="#94a3b8"/>
    <circle cx="56" cy="30" r="11" fill="#334155"/>
    <circle cx="104" cy="30" r="11" fill="#334155"/>
    <circle cx="53" cy="27" r="3" fill="#fff" opacity=".5"/>
    <circle cx="101" cy="27" r="3" fill="#fff" opacity=".5"/>`),
  '1511377107391-116a9d5d20b5': svg('#f3e8ff', `
    <rect x="54" y="10" width="52" height="90" rx="7" fill="#1e1b4b"/>
    <rect x="61" y="18" width="38" height="16" rx="2" fill="#a7f3d0"/>
    ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) =>
      `<rect x="${62 + c * 13}" y="${42 + r * 13}" width="10" height="9" rx="2" fill="${c === 2 && r === 3 ? '#f97316' : '#c7d2fe'}"/>`
    ).join('')).join('')}`),

  '1587133454235-762b65c9f5c0': svg('#ccfbf1', `
    <rect x="44" y="24" width="72" height="62" rx="12" fill="#0f766e"/>
    <rect x="52" y="32" width="56" height="46" rx="8" fill="#14b8a6" opacity=".35"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${68 + i * 8}" cy="74" r="2.5" fill="${i < 3 ? '#a7f3d0' : '#134e4a'}"/>`).join('')}
    <rect x="70" y="86" width="20" height="5" rx="2" fill="#134e4a"/>
    <path d="M82 40 L72 56 H80 L76 68 L88 50 H80 Z" fill="#fff"/>`),

  '1547954569-06aabe3b39b1': svg('#fef3c7', `
    <path d="M60 28 Q80 10 100 28 L120 42 L112 64 L104 60 V98 H56 V60 L48 64 L40 42 Z" fill="#7c3aed"/>
    <path d="M66 28 Q80 44 94 28 Q80 18 66 28 Z" fill="#4c1d95"/>
    <path d="M76 38 V54 M84 38 V54" stroke="#fde68a" stroke-width="2"/>
    <path d="M64 76 H96 V90 H64 Z" fill="#6d28d9"/>`),
};

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    var key = Object.keys(pictures).find(function (k) { return img.src.indexOf(k) !== -1; });
    img.dataset.fallback = '1';
    if (key) img.src = pictures[key];
  }, true);
})();
