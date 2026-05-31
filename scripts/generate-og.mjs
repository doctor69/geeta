import sharp from 'sharp';
import { writeFileSync } from 'fs';

const W = 1200, H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fdf3e3"/>
      <stop offset="100%" stop-color="#f0e0c0"/>
    </linearGradient>
    <linearGradient id="stripe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c8973a" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#c8973a" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Top saffron bar -->
  <rect width="${W}" height="8" fill="#c44a0a"/>

  <!-- Decorative stripe top -->
  <rect y="8" width="${W}" height="200" fill="url(#stripe)"/>

  <!-- Bottom saffron bar -->
  <rect y="${H - 8}" width="${W}" height="8" fill="#c44a0a"/>

  <!-- Side borders -->
  <rect x="60" y="50" width="2" height="${H - 100}" fill="#c8973a" opacity="0.3"/>
  <rect x="${W - 62}" y="50" width="2" height="${H - 100}" fill="#c8973a" opacity="0.3"/>

  <!-- OM symbol -->
  <text x="${W / 2}" y="170" text-anchor="middle" font-family="serif" font-size="110" fill="#c44a0a" opacity="0.9">ॐ</text>

  <!-- Sanskrit title -->
  <text x="${W / 2}" y="260" text-anchor="middle" font-family="serif" font-size="32" fill="#8b5e1a" opacity="0.8" letter-spacing="4">श्रीमद्भगवद्गीता</text>

  <!-- English title -->
  <text x="${W / 2}" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#5c3210" letter-spacing="3">Bhagavad Gita</text>

  <!-- Divider line -->
  <line x1="${W/2 - 200}" y1="360" x2="${W/2 + 200}" y2="360" stroke="#c8973a" stroke-width="1.5" opacity="0.6"/>

  <!-- Tagline -->
  <text x="${W / 2}" y="415" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#7a5020" font-style="italic">Remember the wisdom. Find the verse.</text>

  <!-- Subtitle -->
  <text x="${W / 2}" y="458" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#9a7040">Search all 701 verses by meaning, concept or story</text>

  <!-- Nepal flag image placeholder - use flag emoji or simple flag shape -->
  <!-- Nepal flag simplified shape -->
  <g transform="translate(${W/2 - 22}, 495)">
    <!-- Triangle 1 (bottom wider) -->
    <polygon points="0,56 44,56 44,28 0,56" fill="#003893"/>
    <polygon points="0,0 36,0 36,28 0,56" fill="#003893"/>
    <!-- White border -->
    <polygon points="0,56 44,56 44,28 0,56" fill="none" stroke="white" stroke-width="1.5"/>
    <polygon points="0,0 36,0 36,28 0,56" fill="none" stroke="white" stroke-width="1.5"/>
    <!-- Red fill -->
    <polygon points="2,54 42,54 42,30 2,54" fill="#DC143C"/>
    <polygon points="2,2 34,2 34,27 2,54" fill="#DC143C"/>
    <!-- Moon symbol -->
    <text x="10" y="25" font-size="10" fill="white">☽</text>
    <!-- Sun symbol -->
    <text x="16" y="46" font-size="10" fill="white">✦</text>
  </g>

  <!-- URL -->
  <text x="${W / 2}" y="595" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#b08040" opacity="0.7">doctor69.github.io/geeta</text>
</svg>`;

const buf = Buffer.from(svg);

sharp(buf)
  .resize(W, H)
  .png()
  .toFile('public/og-image.png')
  .then(() => console.log('✓ Generated public/og-image.png'))
  .catch(console.error);
