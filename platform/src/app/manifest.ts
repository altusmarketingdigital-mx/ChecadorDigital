import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ALTUS Checador Digital',
    short_name: 'ALTUS',
    description: 'Sistema SaaS de Control de Asistencia Laboral en la Nube',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#142238',
    theme_color: '#142238',
    orientation: 'any',
    icons: [
      {
        src: '/logo-altus.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
      {
        src: '/logo-altus.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  }
}
