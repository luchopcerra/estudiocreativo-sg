# SG Estudio Creativo — Operativa y Decisiones (Cloudflare Pages)

Este documento resume cómo está configurado el proyecto, decisiones técnicas y cómo operar en Cloudflare Pages.

## Hosting

- Proveedor: Cloudflare Pages
- Dominio: https://estudiocreativo-sg.com
- Build command: `npm run build`
- Output directory: `dist`
- Fallback 200 (Single Page App): habilitar en Pages para soportar rutas limpias `/proyecto/<slug>`.

## Rutas y SEO

- SPA con rutas limpias (sin hash). Se recomienda mantener `react-router` si se agrega en el futuro; actualmente se usa router mínimo propio.
- Canonical, Open Graph y Twitter cards definidos en `index.html`.
- JSON-LD (`LocalBusiness`) insertado en `index.html`.
- `robots.txt` y `sitemap.xml` en `public/` (Cloudflare sirve estáticos desde raíz).

## Imágenes

- Estructura por slug: `src/assets/proyectos/{slug}/{portada|antes|despues}.{webp|jpg|png}`.
- `import.meta.glob` indexa dinámicamente sin `index.js` por carpeta.
- Preferir WebP/AVIF. Mantener nombres `portada/antes/despues`.

## Contacto

- Formulario no envía email; abre WhatsApp con mensaje prellenado. Número centralizado en `WHATSAPP_NUMBER` en `src/App.jsx`.

## Favicons

- Generados con fondo transparente: `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`.

## Mantenimiento

- Al agregar proyectos: crear carpeta de slug y las imágenes; el sitemap debe actualizarse (editar `public/sitemap.xml`).
- Revisar `meta description` y títulos si se agregan vistas nuevas.

## Roadmap sugerido

- Migrar a rutas con `react-router` y actualizar sitemap/canonical por vista.
- Prerender (SSG) de home y proyectos clave para mejor SEO.
- Datos estructurados por proyecto (`CreativeWork`).
