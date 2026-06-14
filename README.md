# SG Estudio Creativo - Portfolio (Vite + React + Tailwind)

## Ejecutar en dev

```bash
npm install
npm run dev
```

## Blog sincronizado con Notion

El sitio puede usar Notion como CMS editorial para publicaciones. La sincronizacion
corre antes del build y genera `src/data/posts.json`.

### Variables de entorno

```bash
NOTION_TOKEN=secret_xxx
NOTION_DATA_SOURCE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

`NOTION_DATABASE_ID` tambien funciona como alias, pero la API actual de Notion
usa `data_source_id`.

### Propiedades recomendadas en Notion

- `Title` o `Name`: titulo del post.
- `Slug`: slug opcional. Si falta, se genera desde el titulo.
- `Published`: checkbox para publicar.
- `Status`: alternativa a `Published`; acepta `Published`, `Publicado`, `Live` o `Activo`.
- `Date`: fecha de publicacion.
- `Tag`: select, status o multi-select.
- `Summary`: bajada corta para tarjetas y SEO.
- `Description`: descripcion opcional.
- `Cover`: archivo o imagen externa opcional. Tambien sirve la portada nativa de la pagina.

El cuerpo del post se toma de los bloques de la pagina: titulos, parrafos,
listas e imagenes.

Para portadas definitivas, conviene usar imagenes externas publicas o subirlas
al repo/CDN. Las URLs de archivos subidos directamente a Notion pueden expirar;
el build las refresca, pero una pagina estatica vieja podria quedarse con una
URL vencida.

### Comandos

```bash
npm run sync:posts:notion
npm run build
```

En Cloudflare Pages, configurar las variables de entorno anteriores. El build
actual ya ejecuta la sincronizacion en modo opcional antes de generar sitemap y
rutas estaticas.
