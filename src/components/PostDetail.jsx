import { useState } from "react";
import PropTypes from "prop-types";
import { ResponsiveImage } from "./ResponsiveImage";
import { formatDateES, WHATSAPP_NUMBER, createWhatsAppLink } from "../utils/helpers";

/**
 * PostDetail Component
 * Displays a blog post with hero image, content blocks, and optional gallery
 *
 * @param {Object} post - Post data from posts.json
 * @param {Function} getPostPicture - Function to get picture data by slug and variant
 */
export function PostDetail({ post, getPostPicture }) {
  const [heroLoaded, setHeroLoaded] = useState(false);

  const hero = getPostPicture?.(post?.slug, post?.cover || "cover");
  const gallery = (post?.gallery || [])
    .map((name) => getPostPicture?.(post?.slug, name))
    .filter(Boolean);

  const formattedDate = formatDateES(post?.date);

  const handleBack = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/#publicaciones");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const whatsappMessage = `Hola SG Estudio Creativo, me interesó la publicación "${post?.title}" y quiero hablar sobre un proyecto.`;
  const whatsappLink = createWhatsAppLink(whatsappMessage);

  return (
    <article className="px-5 md:px-10 mt-14 md:mt-20 mb-16 fade-in">
      <nav aria-label="Navegación de publicación">
        <a
          href="/#publicaciones"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm underline opacity-80 hover:opacity-100 transition-opacity focus-ring rounded"
          aria-label="Volver a publicaciones"
        >
          <span aria-hidden="true">←</span> Volver
        </a>
      </nav>

      <div className="mt-4 lg:mt-10 lg:grid lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start lg:gap-12 xl:gap-16">
        {/* Sidebar */}
        <aside className="space-y-6 lg:space-y-8">
          <div
            className="rounded-3xl border border-black/10 bg-white/80 px-6 py-8 shadow-sm backdrop-blur mb-8 lg:mb-0"
          >
            <div className="space-y-3">
              <div className="space-y-2">
                {post?.tag && (
                  <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-black/70">
                    {post.tag}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl tracking-wide leading-tight">{post?.title}</h1>
              </div>
              {post?.summary && (
                <p className="opacity-90 text-sm md:text-base leading-relaxed">{post.summary}</p>
              )}
            </div>
            {formattedDate && (
              <div className="mt-6 border-t border-black/10 pt-6 text-xs uppercase tracking-[0.1em] text-black/60"
              >
                Publicado el {formattedDate}
              </div>
            )}
          </div>

          <div className="hidden lg:block rounded-3xl border border-black/10 bg-white/60 px-5 py-4 text-sm leading-relaxed text-black/75">
            <p>
              Guardá tus ideas favoritas para llevarlas a tu próximo proyecto.
              Si querés que las trabajemos juntas, escribime.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white transition"
              style={{ background: "var(--sage)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sage-dark)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--sage)")}
            >
              Escribime por WhatsApp
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <div className="space-y-10 lg:space-y-12">
          {hero && (
            <figure
              className="rounded-3xl overflow-hidden border shadow-sm bg-white"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div className="relative aspect-[3/4] w-full">
                <ResponsiveImage
                  picture={hero}
                  alt={post?.title}
                  sizes="100vw"
                  eager
                  onLoad={() => setHeroLoaded(true)}
                />
                {!heroLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-[var(--sage)]/20" />
                )}
              </div>
            </figure>
          )}

          {Array.isArray(post?.blocks) && post.blocks.length > 0 && (
            <div className="grid gap-6 max-w-3xl">
              {post.blocks.map((block, i) => (
                <div key={i}>
                  {block.title && (
                    <h3 className="text-lg font-medium">{block.title}</h3>
                  )}
                  {block.text && (
                    <p className="opacity-90 mt-2 leading-relaxed">{block.text}</p>
                  )}
                  {Array.isArray(block.items) && (
                    <ul className="list-disc list-inside mt-2 opacity-90 space-y-1">
                      {block.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
          {gallery.map((pic, i) => (
            <figure
              key={i}
              className="rounded-3xl overflow-hidden border shadow-sm bg-white"
              style={{ borderColor: "var(--border-light)" }}
            >
              <ResponsiveImage
                picture={pic}
                alt={`${post?.title} - Imagen ${i + 1}`}
                sizes="(min-width:768px) 50vw, 100vw"
              />
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}

PostDetail.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tag: PropTypes.string,
    summary: PropTypes.string,
    cover: PropTypes.string,
    gallery: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  getPostPicture: PropTypes.func.isRequired,
};
