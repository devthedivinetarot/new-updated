import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Divine Tarot — Premium Tarot Readings',
    short_name: 'Divine Tarot',
    description:
      'Mystical, emotionally intelligent tarot readings in English, Hindi and Hinglish. Get spiritual guidance from the universe in seconds.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050508',
    theme_color: '#6d28d9',
    lang: 'en',
    dir: 'ltr',
    categories: ['lifestyle', 'entertainment', 'spirituality'],
    // NOTE: favicon.ico is intentionally NOT listed here. Declaring a raster
    // .ico with sizes:'any' triggers Chrome's "Resource size is not correct"
    // manifest warning. The .ico is still served as the browser-tab favicon
    // via Next's file-based metadata, independent of this manifest.
    icons: [
      { src: '/logo.png', sizes: '426x500', type: 'image/png', purpose: 'any' },
    ],
  };
}
