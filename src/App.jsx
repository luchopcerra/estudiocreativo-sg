import React from "react";
import {
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Phone,
} from "lucide-react";
import highlight from "./assets/meta/destacada.webp";
import portrait from "./assets/meta/portrait.webp";
import projects from "./data/projects.json";
import posts from "./data/posts.json";
import testimonials from "./data/testimonials.json";
import services from "./data/services.json";

const PALETTE = {
  sage: "#959c89", // verde salvia (banda)
  sageDark: "#86907E",
  ivory: "#F6F3EE", // fondo marfil
  charcoal: "#101010",
  graphite: "#2B2B2B",
};

// Contacto: número de WhatsApp centralizado (solo dígitos con prefijo país)
const WHATSAPP_NUMBER = "5492914441533";

// Helper de slug: normaliza a minúsculas, sin tildes/ñ
const canonSlug = (s) => {
  try {
    s = decodeURIComponent(String(s));
  } catch {}
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Imágenes responsivas por slug/variante usando vite-imagetools

const pictureMods = import.meta.glob(
  "./assets/proyectos/*/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?as=picture&w=480;768;1200;1600&format=avif;webp;jpg&quality=75",
  }
);
const PICTURES = Object.entries(pictureMods).reduce((acc, [path, mod]) => {
  const parts = path.split("/"); // [".", "assets", "proyectos", slug, filename?query]
  const slug = canonSlug(parts[3]);
  const fileWithQuery = parts[4];
  const baseFile = fileWithQuery.split("?")[0];
  const variant = baseFile.split(".")[0];
  const pic = mod?.default || mod;
  if (pic && pic.sources && pic.img) {
    acc[slug] = acc[slug] || {};
    acc[slug][variant] = pic;
  }
  return acc;
}, {});
const getPicture = (slug, variant) => {
  const key = canonSlug(slug);
  return PICTURES?.[key]?.[variant] || null;
};

// Imágenes para publicaciones (misma mecánica que proyectos)
const postPictureMods = import.meta.glob(
  "./assets/posts/*/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?as=picture&w=480;768;1200;1600&format=avif;webp;jpg&quality=75",
  }
);
const POST_PICTURES = Object.entries(postPictureMods).reduce(
  (acc, [path, mod]) => {
    const parts = path.split("/"); // [., assets, publicaciones, slug, filename?query]
    const slug = canonSlug(parts[3]);
    const fileWithQuery = parts[4];
    const baseFile = fileWithQuery.split("?")[0];
    const variant = baseFile.split(".")[0];
    const pic = mod?.default || mod;
    if (pic && pic.sources && pic.img) {
      acc[slug] = acc[slug] || {};
      acc[slug][variant] = pic;
    }
    return acc;
  },
  {}
);
const getPostPicture = (slug, variant) => {
  const key = canonSlug(slug);
  return POST_PICTURES?.[key]?.[variant] || null;
};

export default function App() {
  // Router mínimo con History API: paths limpios y anchors para secciones
  const [path, setPath] = React.useState(window.location.pathname);
  const [hash, setHash] = React.useState(window.location.hash || "");

  // Helper: navegación SPA con pushState
  const navigateTo = React.useCallback((url) => {
    const u = new URL(url, window.location.origin);
    window.history.pushState({}, "", u.pathname + u.hash);
    setPath(u.pathname);
    setHash(u.hash);
  }, []);

  React.useEffect(() => {
    // Actualizar estado al navegar con back/forward
    const onPop = () => {
      setPath(window.location.pathname);
      setHash(window.location.hash || "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  React.useEffect(() => {
    // Compat: transformar #proyecto/<slug> o #post/<slug> a rutas limpias
    const h = window.location.hash || "";
    const proj = h.match(/^#proyecto\/(.+)$/);
    const pst = h.match(/^#post\/(.+)$/);
    if (proj) {
      const slug = decodeURIComponent(proj[1]);
      window.history.replaceState({}, "", `/proyecto/${slug}`);
      setPath(`/proyecto/${slug}`);
      setHash("");
      return;
    }
    if (pst) {
      const slug = decodeURIComponent(pst[1]);
      window.history.replaceState({}, "", `/post/${slug}`);
      setPath(`/post/${slug}`);
      setHash("");
      return;
    }
  }, []);

  React.useEffect(() => {
    // Mantener estado de hash para anchors de secciones y permitir volver a home desde detalle
    const onHash = () => {
      const newHash = window.location.hash || "";
      const onDetail = /^\/proyecto\//.test(window.location.pathname) || /^\/post\//.test(window.location.pathname);
      // Si estamos en detalle y el hash apunta a una sección (no detalle), ir a home manteniendo el hash
      if (onDetail && newHash && !newHash.startsWith("#proyecto/") && !newHash.startsWith("#post/")) {
        window.history.replaceState({}, "", `/${newHash}`);
        setPath("/");
        setHash(newHash);
      } else {
        setHash(newHash);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Scroll automático a anchors cuando estamos en home
  React.useEffect(() => {
    if (path !== "/") return;
    const id = (hash || "").slice(1);
    if (!id) return;
    // esperar al próximo frame para garantizar el render
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [path, hash]);

  // rutas detalle limpias: /proyecto/<slug> y /post/<slug>
  const projMatch = path.match(/^\/proyecto\/(.+)$/);
  const detailSlug = projMatch ? projMatch[1] : null;
  const project = detailSlug
    ? projects.find(
        (p) => decodeURIComponent(p.slug) === decodeURIComponent(detailSlug),
      )
    : null;

  const pstMatch = path.match(/^\/post\/(.+)$/);
  const postSlug = pstMatch ? pstMatch[1] : null;
  const post = postSlug
    ? posts.find(
        (p) => decodeURIComponent(p.slug) === decodeURIComponent(postSlug),
      )
    : null;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: PALETTE.ivory, color: PALETTE.charcoal }}
    >
      <Header onNavigate={navigateTo} />

      <div className="relative mx-auto max-w-[1400px]">
        {project ? (
          <ProjectDetail project={project} />
        ) : post ? (
          <PostDetail post={post} />
        ) : (
          <>
            <Hero />
            <Posts onNavigate={navigateTo} />
            <Projects onNavigate={navigateTo} />
            <Testimonials />
            <About />
            <Contact />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Header({ onNavigate }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  // Evita parpadeo al inicio aplicando histéresis en el umbral
  // ON cuando supera THRESHOLD_ON; OFF cuando baja de THRESHOLD_OFF
  const scrolledRef = React.useRef(false);
  const THRESHOLD_ON = 24; // px
  const THRESHOLD_OFF = 8; // px

  React.useEffect(() => {
    const updateScrolled = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const next = scrolledRef.current ? y > THRESHOLD_OFF : y > THRESHOLD_ON;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    const onHash = () => setOpen(false);
    // Estado inicial
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // Medir alto del header para compensar cuando pasa a fixed
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const topBarPadding = scrolled ? "py-2 md:py-3" : "py-4 md:py-6";
  const logoSize = scrolled
    ? "text-[32px] md:text-[36px]"
    : "text-[36px] md:text-[40px]";
  const subTitleSize = scrolled
    ? "text-[16px] md:text-[18px]"
    : "text-[18px] md:text-[20px]";

  const positionClass = scrolled
    ? "fixed top-0 left-0 right-0"
    : "sticky top-0";

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full ${positionClass} z-50 transition-all ${
          scrolled ? "shadow-sm border-b backdrop-blur-md" : ""
        }`}
        style={{
          background: scrolled ? "rgba(246,243,238,0.85)" : PALETTE.ivory,
          borderColor: "#00000012",
        }}
      >
        {/* Header móvil: logo + botón hamburguesa */}
        <div
          className={`relative mx-auto max-w-[1400px] flex items-center justify-between px-5 md:px-10 ${topBarPadding} md:hidden`}
        >
          <a
            href="/#top"
            className="group inline-flex items-end gap-3"
            aria-label="SG Estudio Creativo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/#top");
            }}
          >
            <span
              className={`font-black tracking-tight brand-sg-md leading-none transition-all ${logoSize}`}
            >
              SG
            </span>
            <span className="leading-none">
              <span
                className={`block tracking-[0.12em] lowercase transition-all ${subTitleSize}`}
              >
                estudio creativo
              </span>
              <span className="block text-xs md:text-sm opacity-80 mt-1 transition-all">
                diseño de interiores y arquitectura
              </span>
            </span>
          </a>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            style={{ borderColor: PALETTE.graphite }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          {open && (
            <div
              className="absolute left-0 right-0 top-full md:hidden px-5 pb-4 border-t shadow-sm"
              style={{ background: PALETTE.ivory, borderColor: "#00000012" }}
            >
              <nav className="mt-2 grid gap-2 text-sm">
                {[
                  ["Publicaciones", "/#publicaciones"],
                  ["Servicios", "/#servicios"],
                  ["Opiniones", "/#opiniones"],
                  ["Sobre mí", "/#sobre"],
                  ["Contacto", "/#contacto"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="transition-colors btn-sage w-full justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      onNavigate(href);
                    }}
                  >
                    {label} <ArrowRight size={16} />
                  </a>
                ))}
                <a
                  href="/#trabajos"
                  className="transition-colors btn-sage rounded-xl border px-3 py-2 inline-flex items-center gap-2 justify-center hover:bg-[var(--charcoal)] hover:text-white"
                  style={{
                    borderColor: PALETTE.charcoal,
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    onNavigate("/#trabajos");
                  }}
                >
                  Ver trabajos <ArrowRight size={16} />
                </a>
              </nav>
            </div>
          )}
        </div>
        {/* Top bar — sólo desktop */}
        <div
          className={`relative mx-auto max-w-[1400px] hidden md:flex items-center justify-between px-5 md:px-10 ${topBarPadding}`}
        >
          <a
            href="/#top"
            className="group inline-flex items-end gap-3"
            aria-label="SG Estudio Creativo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/#top");
            }}
          >
            <span
              className={`font-black tracking-tight brand-sg-md leading-none transition-all ${logoSize}`}
            >
              SG
            </span>
            <span className="leading-none">
              <span
                className={`block tracking-[0.12em] lowercase transition-all ${subTitleSize}`}
              >
                estudio creativo
              </span>
              <span className="block text-xs md:text-sm opacity-80 mt-1 transition-all">
                diseño de interiores y arquitectura
              </span>
            </span>
          </a>

          {/* Nav */}
          <nav className="flex items-center gap-2 text-sm">
            {[
              ["Publicaciones", "/#publicaciones"],
              ["Servicios", "/#servicios"],
              ["Opiniones", "/#opiniones"],
              ["Sobre mí", "/#sobre"],
              ["Contacto", "/#contacto"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="transition-colors btn-sage"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(href);
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="/#trabajos"
              className="transition-colors btn-sage rounded-full border px-3 py-1 inline-flex items-center gap-2 hover:bg-[var(--charcoal)] hover:text-white"
              style={{
                borderColor: PALETTE.charcoal,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/#trabajos");
              }}
            >
              Ver trabajos <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      </header>
      {/* Spacer para evitar salto cuando el header está fixed */}
      <div aria-hidden="true" style={{ height: scrolled ? headerHeight : 0 }} />
    </>
  );
}

function Hero() {
  return (
    <section
      className="relative px-5 md:px-10 md:mt-24 overflow-hidden"
      id="top"
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {/* Bloque de marca grande: oculto en mobile por redundancia con el header */}
          <div className="hidden md:flex items-end gap-6">
            <span className="brand-sg text-[120px] md:text-[160px] leading-none">
              SG
            </span>
            <div className="mb-3">
              <div className="text-[40px] md:text-[48px] tracking-[0.18em] lowercase leading-none">
                estudio creativo
              </div>
              <div className="text-base md:text-lg opacity-80 mt-2">
                diseño de interiores y arquitectura
              </div>
            </div>
          </div>
          <p className="max-w-xl mt-8 text-base md:text-lg opacity-90">
            Proyectos residenciales y comerciales con enfoque funcional, cálido
            y atemporal. Renderes hiperrealistas, seguimiento de obra y
            acompañamiento integral.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contacto"
              className="text-sm md:text-base transition-colors btn-sage bg-[var(--charcoal)] text-white hover:bg-[var(--sage)] hover:text-white"
            >
              Solicitar presupuesto
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-md">
          <img
            src={highlight}
            alt="Render destacado: Cocina Blanco Norte"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      id="trabajos"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl tracking-wide">
          Trabajos seleccionados
        </h2>
        <a
          href="/#contacto"
          className="hidden md:inline-block text-sm underline btn-sage"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/#contacto");
            window.dispatchEvent(new HashChangeEvent("hashchange"));
          }}
        >
          ¿Tenés un proyecto? Conversemos
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-8">
        {projects.map((p, i) => (
          <ProjectCard key={i} title={p.title} tag={p.tag} slug={p.slug} />
        ))}
      </div>

      <div
        id="servicios"
        className="mt-16 md:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24 md:scroll-mt-28"
      >
        {services.map(([title, desc]) => (
          <div
            key={String(title)}
            className="rounded-3xl p-6 border"
            style={{ borderColor: PALETTE.graphite }}
          >
            <div className="text-lg font-medium">{title}</div>
            <p className="opacity-80 mt-2 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Posts({ onNavigate }) {
  if (!posts || posts.length === 0) return null;
  const scrollerRef = React.useRef(null);
  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card="post"]');
    const step = card ? card.getBoundingClientRect().width + 24 : 360 + 24; // width + gap
    el.scrollBy({ left: dir * step * 3, behavior: "smooth" });
  };
  const showArrows = posts.length > 3;
  return (
    <section
      id="publicaciones"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl tracking-wide">Publicaciones</h2>
        {showArrows && (
          <div className="hidden md:flex items-center gap-2">
            <button className="btn-sage px-3 py-1 rounded-full border" style={{borderColor: PALETTE.charcoal}} onClick={() => scrollByCards(-1)}>
              ←
            </button>
            <button className="btn-sage px-3 py-1 rounded-full border" style={{borderColor: PALETTE.charcoal}} onClick={() => scrollByCards(1)}>
              →
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollerRef}
        className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{scrollbarWidth: "thin"}}
      >
        {posts.map((p) => (
          <div key={p.slug} className="w-[360px] snap-start shrink-0" data-card="post">
            <PostCard post={p} onNavigate={onNavigate} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PostCard({ post, onNavigate }) {
  const pic = getPostPicture(post.slug, post.cover || "cover");
  const [loaded, setLoaded] = React.useState(false);
  return (
    <article className="group rounded-3xl overflow-hidden border shadow-sm" style={{ borderColor: "#00000012" }}>
      <div className="relative aspect-[4/3]">
        {pic ? (
          <>
            <picture>
              {(pic.sources ? (Array.isArray(pic.sources) ? pic.sources : [pic.sources]) : []).map((s, idx) => (
                <source key={s?.srcset || s?.src || idx} srcSet={s?.srcset || s?.src} type={s?.type} sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw" />
              ))}
              <img
                src={pic.img.src}
                alt={post.title}
                className={`w-full h-full object-cover transition-[filter,opacity] duration-500 ${loaded ? "opacity-100" : "opacity-80 blur-[2px]"}`}
                loading="lazy"
                decoding="async"
                sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </picture>
            {!loaded && <div className="absolute inset-0 animate-pulse" style={{ background: "#E6E2DA" }} />}
          </>
        ) : (
          <PlaceholderImage label={post.title} />
        )}
      </div>
      <div className="p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg">{post.title}</h3>
          {post.tag && (
            <p className="text-xs md:text-sm opacity-70">{post.tag}</p>
          )}
        </div>
        <a
          href={`/post/${encodeURIComponent(decodeURIComponent(post.slug))}`}
          className="text-xs md:text-sm opacity-90 transition-colors btn-sage"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/post/${encodeURIComponent(decodeURIComponent(post.slug))}`);
          }}
        >
          Leer
        </a>
      </div>
    </article>
  );
}

function PostDetail({ post }) {
  const hero = getPostPicture(post.slug, post.cover || "cover");
  const gallery = (post.gallery || []).map((name) => getPostPicture(post.slug, name)).filter(Boolean);
  const [heroLoaded, setHeroLoaded] = React.useState(false);
  return (
    <section className="px-5 md:px-10 mt-14 md:mt-20 mb-16">
      <a
        href="/#publicaciones"
        className="text-sm underline opacity-80"
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, "", "/#publicaciones");
          // Actualizar estado de path y hash en App y luego scrollear
          window.dispatchEvent(new PopStateEvent("popstate"));
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }}
      >
        ← Volver
      </a>
      <h1 className="text-2xl md:text-3xl tracking-wide mt-4">{post.title}</h1>
      {post.summary && (
        <p className="opacity-90 mt-3 max-w-prose text-sm md:text-base">{post.summary}</p>
      )}

      {hero && (
        <figure className="rounded-3xl overflow-hidden border shadow-sm bg-white mt-6" style={{ borderColor: "#00000012" }}>
          <div className="relative aspect-[3/4] w-full">
            <picture className="absolute inset-0">
              {(hero.sources ? (Array.isArray(hero.sources) ? hero.sources : [hero.sources]) : []).map((s, idx) => (
                <source key={s?.srcset || s?.src || idx} srcSet={s?.srcset || s?.src} type={s?.type} sizes="100vw" />
              ))}
              <img
                src={hero.img.src}
                alt={post.title}
                className={`w-full h-full object-cover transition-[filter,opacity] duration-500 ${heroLoaded ? "opacity-100" : "opacity-80 blur-[2px]"}`}
                loading="eager"
                decoding="async"
                sizes="100vw"
                onLoad={() => setHeroLoaded(true)}
                onError={() => setHeroLoaded(true)}
              />
            </picture>
          </div>
        </figure>
      )}

      {Array.isArray(post.blocks) && post.blocks.length > 0 && (
        <div className="mt-8 grid gap-6 max-w-3xl">
          {post.blocks.map((b, i) => (
            <div key={i}>
              {b.title && <h3 className="text-lg font-medium">{b.title}</h3>}
              {b.text && <p className="opacity-90 mt-2 leading-relaxed">{b.text}</p>}
              {Array.isArray(b.items) && (
                <ul className="list-disc list-inside mt-2 opacity-90 space-y-1">
                  {b.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {gallery.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
          {gallery.map((pic, i) => (
            <figure key={i} className="rounded-3xl overflow-hidden border shadow-sm bg-white" style={{ borderColor: "#00000012" }}>
              <picture>
                {(pic.sources ? (Array.isArray(pic.sources) ? pic.sources : [pic.sources]) : []).map((s, idx) => (
                  <source key={s?.srcset || s?.src || idx} srcSet={s?.srcset || s?.src} type={s?.type} sizes="(min-width:768px) 50vw, 100vw" />
                ))}
                <img src={pic.img.src} alt={post.title} className="w-full h-full object-cover" loading="lazy" decoding="async" sizes="(min-width:768px) 50vw, 100vw" />
              </picture>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ title, tag, img, slug }) {
  const pic = getPicture(slug, "portada");
  const [loaded, setLoaded] = React.useState(false);
  return (
    <article
      className="group rounded-3xl overflow-hidden border shadow-sm"
      style={{ borderColor: "#00000012" }}
    >
      <div className="relative aspect-[4/3]">
        {pic ? (
          <>
            <picture>
              {(pic.sources
                ? Array.isArray(pic.sources)
                  ? pic.sources
                  : [pic.sources]
                : []
              ).map((s, idx) => (
                <source
                  key={s?.srcset || s?.src || idx}
                  srcSet={s?.srcset || s?.src}
                  type={s?.type}
                  sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                />
              ))}
              <img
                src={pic.img.src}
                alt={title}
                className={`w-full h-full object-cover transition-[filter,opacity] duration-500 ${
                  loaded ? "opacity-100" : "opacity-80 blur-[2px]"
                }`}
                loading="lazy"
                decoding="async"
                sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </picture>
            {!loaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ background: "#E6E2DA" }}
              />
            )}
          </>
        ) : (
          <PlaceholderImage label={title} />
        )}
        <div
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs tracking-wide"
          style={{ background: "#ffffffD8", color: "#111" }}
        >
          {tag}
        </div>
      </div>
      <div className="p-5 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg">{title}</h3>
          <p className="text-xs md:text-sm opacity-70">
            2024–2025 · <span className="brand-sg-xs">SG</span> estudio creativo
          </p>
        </div>
        <a
          href={`/proyecto/${encodeURIComponent(decodeURIComponent(slug))}`}
          className="text-xs md:text-sm opacity-90 transition-colors btn-sage"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", `/proyecto/${encodeURIComponent(decodeURIComponent(slug))}`);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
        >
          Ver
        </a>
      </div>
    </article>
  );
}

function ProjectDetail({ project }) {
  const beforePic = getPicture(project.slug, "antes");
  const afterPic =
    getPicture(project.slug, "despues") || getPicture(project.slug, "portada");
  const [beforeLoaded, setBeforeLoaded] = React.useState(false);
  const [afterLoaded, setAfterLoaded] = React.useState(false);
  return (
    <section className="px-5 md:px-10 mt-14 md:mt-20 mb-16">
      <a
        href="/#trabajos"
        className="text-sm underline opacity-80"
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, "", "/#trabajos");
          // Actualizar estado de path y hash en App y luego scrollear
          window.dispatchEvent(new PopStateEvent("popstate"));
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }}
      >
        ← Volver
      </a>
      <h1 className="text-2xl md:text-3xl tracking-wide mt-4">
        {project.title}
      </h1>
      <p className="opacity-90 mt-3 max-w-prose text-sm md:text-base">
        {project.description}
      </p>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
        <figure
          className="rounded-3xl overflow-hidden border shadow-sm bg-white"
          style={{ borderColor: "#00000012" }}
        >
          {beforePic ? (
            <>
              <picture>
                {(beforePic.sources
                  ? Array.isArray(beforePic.sources)
                    ? beforePic.sources
                    : [beforePic.sources]
                  : []
                ).map((s, idx) => (
                  <source
                    key={s?.srcset || s?.src || idx}
                    srcSet={s?.srcset || s?.src}
                    type={s?.type}
                    sizes="(min-width:768px) 50vw, 100vw"
                  />
                ))}
                <img
                  src={beforePic.img.src}
                  alt={`${project.title} - Antes`}
                  className={`w-full h-full object-cover transition-[filter,opacity] duration-500 ${
                    beforeLoaded ? "opacity-100" : "opacity-80 blur-[2px]"
                  }`}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width:768px) 50vw, 100vw"
                  onLoad={() => setBeforeLoaded(true)}
                  onError={() => setBeforeLoaded(true)}
                />
              </picture>
              {!beforeLoaded && (
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ background: "#EDE9E3" }}
                />
              )}
            </>
          ) : (
            <PlaceholderImage label="Antes" />
          )}
          <figcaption className="px-4 py-2 text-xs opacity-70">
            El antes
          </figcaption>
        </figure>
        <figure
          className="rounded-3xl overflow-hidden border shadow-sm bg-white"
          style={{ borderColor: "#00000012" }}
        >
          {afterPic ? (
            <>
              <picture>
                {(afterPic.sources
                  ? Array.isArray(afterPic.sources)
                    ? afterPic.sources
                    : [afterPic.sources]
                  : []
                ).map((s, idx) => (
                  <source
                    key={s?.srcset || s?.src || idx}
                    srcSet={s?.srcset || s?.src}
                    type={s?.type}
                    sizes="(min-width:768px) 50vw, 100vw"
                  />
                ))}
                <img
                  src={afterPic.img.src}
                  alt={`${project.title} - Después`}
                  className={`w-full h-full object-cover transition-[filter,opacity] duration-500 ${
                    afterLoaded ? "opacity-100" : "opacity-80 blur-[2px]"
                  }`}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width:768px) 50vw, 100vw"
                  onLoad={() => setAfterLoaded(true)}
                  onError={() => setAfterLoaded(true)}
                />
              </picture>
              {!afterLoaded && (
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ background: "#EDE9E3" }}
                />
              )}
            </>
          ) : (
            <PlaceholderImage label="Después" />
          )}
          <figcaption className="px-4 py-2 text-xs opacity-70">
            El después
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      id="opiniones"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <h2 className="text-2xl md:text-3xl tracking-wide">Opiniones</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-3xl border p-6 md:p-8"
            style={{ borderColor: PALETTE.graphite }}
          >
            <p className="text-sm md:text-base leading-relaxed">“{t.text}”</p>
            <div className="mt-4 text-xs opacity-70">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="sobre"
      className="px-5 md:px-10 mt-20 md:mt-28 grid gap-10 items-start scroll-mt-24 md:scroll-mt-28 md:[grid-template-columns:280px_1fr]"
    >
      <div className="justify-self-center md:justify-self-start w-40 md:w-auto">
        <figure
          className="relative aspect-[3/4] w-40 md:w-[280px] rounded-3xl overflow-hidden border shadow-sm bg-white"
          style={{ borderColor: "#00000012" }}
        >
          <img
            src={portrait}
            alt="Foto de Sol Gauna"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(min-width:768px) 280px, 160px"
          />
          <figcaption className="sr-only">Sol Gauna — Estudio Creativo</figcaption>
        </figure>
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl tracking-wide">Sobre mí</h2>
        <p className="mt-4 opacity-90 leading-relaxed max-w-3xl">
          Soy Sol, diseñadora de interiores. Creo espacios equilibrados,
          luminosos y humanos. Trabajo con una metodología clara: relevamiento,
          anteproyecto, selección de materiales, visualizaciones hiperrealistas
          y ejecución.
        </p>
        <ul className="mt-6 space-y-2 text-sm opacity-90 list-disc pl-5">
          <li>Enfoque: calidez, funcionalidad, atemporalidad.</li>
          <li>Entregables: planos, renders, lista de compras y presupuesto.</li>
          <li>
            Modalidades: online en todo el país y presencial en VGB y
            alrededores.
          </li>
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  const [nombre, setNombre] = React.useState("");
  const [detalle, setDetalle] = React.useState("");
  const [touched, setTouched] = React.useState({
    nombre: false,
    detalle: false,
  });
  const [submitted, setSubmitted] = React.useState(false);

  const nameError = nombre.trim().length < 2 ? "Ingresá tu nombre" : "";
  const detailError =
    detalle.trim().length < 10 ? "Contá un poco más (mín. 10 caracteres)" : "";
  const isValid = !nameError && !detailError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    const parts = [];
    if (nombre.trim()) parts.push(`Hola, soy ${nombre.trim()}.`);
    if (detalle.trim()) parts.push(`Mi proyecto: ${detalle.trim()}`);
    const text = parts.join("\n\n");
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      text
    )}`;
    window.open(waUrl, "_blank");
  };
  return (
    <section
      id="contacto"
      className="px-5 md:px-10 mt-20 md:mt-28 mb-24 scroll-mt-24 md:scroll-mt-28"
    >
      <div
        className="rounded-3xl border p-6 md:p-10"
        style={{ borderColor: PALETTE.graphite }}
      >
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl tracking-wide">Contacto</h2>
            <p className="mt-3 opacity-90 max-w-prose">
              Contame tu proyecto (ambiente, medidas aproximadas, estilo,
              materiales deseados y presupuesto). Te respondo con una propuesta.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="mailto:solg.estudiocreativo@gmail.com"
                className="flex items-center gap-3 hover:opacity-70"
              >
                <Mail size={18} /> solg.estudiocreativo@gmail.com
              </a>
              <a
                href="https://www.instagram.com/solg.estudiocreativo"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:opacity-70"
              >
                <Instagram size={18} /> @solg.estudiocreativo
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 hover:opacity-70"
              >
                <Phone size={18} /> +54 9 2914 44-1533
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=R%C3%ADo%20Medio%20657%2C%20Villa%20General%20Belgrano%2C%20C%C3%B3rdoba"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:opacity-70"
              >
                <MapPin size={18} /> Río Medio 657, Villa General Belgrano,
                Córdoba · Atención online a todo el país
              </a>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <input
              className={`rounded-xl border px-4 py-3 bg-transparent ${
                (submitted || touched.nombre) && nameError
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              aria-invalid={(submitted || touched.nombre) && !!nameError}
            />
            {(submitted || touched.nombre) && nameError && (
              <div className="text-xs text-red-600 -mt-2">{nameError}</div>
            )}
            <textarea
              className={`rounded-xl border px-4 py-3 min-h-[140px] bg-transparent ${
                (submitted || touched.detalle) && detailError
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Contame brevemente tu proyecto"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, detalle: true }))}
              aria-invalid={(submitted || touched.detalle) && !!detailError}
            />
            {(submitted || touched.detalle) && detailError && (
              <div className="text-xs text-red-600 -mt-2">{detailError}</div>
            )}
            <button
              type="submit"
              disabled={!isValid}
              className={`justify-self-start inline-flex items-center gap-2 transition-colors ${
                !isValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Enviar consulta <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="w-full bg-[var(--charcoal)] text-white border-t"
      style={{ borderColor: "#FFFFFF22" }}
    >
      <div className="px-5 md:px-10 py-14 md:py-18 relative mx-auto max-w-[1400px]">
        {/* Top row: brand + quick links */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="flex items-end gap-3">
            <span className="font-black brand-sg-sm text-[26px] md:text-[28px] leading-none">
              SG
            </span>
            <div className="leading-none">
              <div className="text-sm tracking-[0.14em] lowercase">
                estudio creativo
              </div>
              <div className="text-xs opacity-80">
                diseño de interiores y arquitectura
              </div>
            </div>
          </div>

          {/* Nav links removidos por redundancia con header sticky */}
        </div>

        {/* Divider */}
        <div className="my-6" style={{ height: 1, background: "#FFFFFF1A" }} />

        {/* Bottom row: owner + socials + legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-xs md:text-sm opacity-90">
            Dirigido por <span className="font-medium">Sol Gauna</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity text-xs md:text-sm"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <Phone size={16} /> +54 9 2914 44-1533
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:solg.estudiocreativo@gmail.com"
              className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity text-xs md:text-sm"
              aria-label="Email"
              title="Email"
            >
              <Mail size={16} /> solg.estudiocreativo@gmail.com
            </a>
            <a
              href="https://www.instagram.com/solg.estudiocreativo/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram — solg.estudiocreativo"
              className="opacity-90 hover:opacity-100 transition-opacity"
              title="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          <div className="text-[11px] md:text-xs opacity-70">
            © {new Date().getFullYear()}{" "}
            <span className="brand-sg-xs">SG</span> estudio creativo — Todos los
            derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}

function PlaceholderImage({ label }) {
  return (
    <div className="w-full h-full relative">
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.sage} 0%, ${PALETTE.sageDark} 100%)`,
        }}
      />
      <div className="absolute inset-0 flex items-end justify-between p-4">
        <div
          className="rounded-xl px-3 py-1 text-[11px] tracking-wide"
          style={{ background: "#00000080", color: "#fff" }}
        >
          {label}
        </div>
        <div
          className="rounded-xl px-2 py-1 text-[10px]"
          style={{ background: "#ffffffCC" }}
        >
          4:3 / hi-res
        </div>
      </div>
    </div>
  );
}
