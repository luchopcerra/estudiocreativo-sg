import React from "react";
import PropTypes from "prop-types";
import {
  Mail,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { Instagram } from "./components/icons/SocialIcons";

import { ResponsiveImage, PlaceholderImage, ErrorBoundary } from "./components";
import { ProjectDetail, PostDetail } from "./components";
import { useFocusTrap, useScrollLock } from "./hooks/useFocusTrap";
import {
  canonSlug,
  isNewPost,
  formatDateES,
  WHATSAPP_NUMBER,
  createWhatsAppLink,
  preloadImages,
} from "./utils/helpers";

import highlight from "./assets/meta/destacada.webp";
import portrait from "./assets/meta/portrait.webp";
import projects from "./data/projects.json";
import posts from "./data/posts.json";
import testimonials from "./data/testimonials.json";
import services from "./data/services.json";

// Import and process images using vite-imagetools
const pictureMods = import.meta.glob(
  "./assets/proyectos/*/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?as=picture&w=480;768;1200;1600&format=avif;webp;jpg&quality=75",
  }
);

const PICTURES = Object.entries(pictureMods).reduce((acc, [path, mod]) => {
  const parts = path.split("/");
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

// Post images import
const postPictureMods = import.meta.glob(
  "./assets/posts/*/*.{jpg,jpeg,png,webp,avif}",
  {
    eager: true,
    query: "?as=picture&w=480;768;1200;1600&format=avif;webp;jpg&quality=75",
  }
);

const POST_PICTURES = Object.entries(postPictureMods).reduce(
  (acc, [path, mod]) => {
    const parts = path.split("/");
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

/**
 * NotFound Component
 * Displays a 404 page when route is not found
 */
function NotFound({ onNavigate }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5" style={{ background: "var(--ivory)" }}>
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-medium mb-4 brand-sg-sm">404</h1>
        <p className="opacity-80 mb-6">
          La página que buscás no existe o fue movida.
        </p>
        <button
          onClick={() => onNavigate("/")}
          className="btn-sage border border-[var(--charcoal)] px-6 py-2 rounded-full hover:bg-[var(--charcoal)] hover:text-white transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

NotFound.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

export default function App() {
  const [path, setPath] = React.useState(window.location.pathname);
  const [hash, setHash] = React.useState(window.location.hash || "");

  // Navigation helper
  const navigateTo = React.useCallback((url) => {
    const u = new URL(url, window.location.origin);
    window.history.pushState({}, "", u.pathname + u.hash);
    setPath(u.pathname);
    setHash(u.hash);
    if (!u.hash) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }
  }, []);

  // Handle browser back/forward
  React.useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      setHash(window.location.hash || "");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Transform legacy hash routes to clean paths
  React.useEffect(() => {
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

  // Handle hash changes for section navigation
  React.useEffect(() => {
    const onHash = () => {
      const newHash = window.location.hash || "";
      const onDetail =
        /^\/proyecto\//.test(window.location.pathname) ||
        /^\/post\//.test(window.location.pathname);
      if (
        onDetail &&
        newHash &&
        !newHash.startsWith("#proyecto/") &&
        !newHash.startsWith("#post/")
      ) {
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

  // Auto-scroll to anchors on home page
  React.useEffect(() => {
    if (path !== "/") return;
    const id = (hash || "").slice(1);
    if (!id) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [path, hash]);

  // Route matching
  const projMatch = path.match(/^\/proyecto\/(.+)$/);
  const detailSlug = projMatch ? projMatch[1] : null;
  const project = detailSlug
    ? projects.find(
        (p) =>
          decodeURIComponent(p.slug) === decodeURIComponent(detailSlug)
      )
    : null;

  const pstMatch = path.match(/^\/post\/(.+)$/);
  const postSlug = pstMatch ? pstMatch[1] : null;
  const post = postSlug
    ? posts.find(
        (p) =>
          decodeURIComponent(p.slug) === decodeURIComponent(postSlug)
      )
    : null;

  const isNotFound =
    (detailSlug && !project) || (postSlug && !post);

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ background: "var(--ivory)", color: "var(--charcoal)" }}
      >
        <Header onNavigate={navigateTo} path={path} />

        <div className="relative mx-auto max-w-[1400px]">
          {project ? (
            <ProjectDetail project={project} getPicture={getPicture} />
          ) : post ? (
            <PostDetail post={post} getPostPicture={getPostPicture} />
          ) : isNotFound ? (
            <NotFound onNavigate={navigateTo} />
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
    </ErrorBoundary>
  );
}

/**
 * Header Component
 * Sticky header with scroll behavior and mobile menu
 */
function Header({ onNavigate, path }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const scrolledRef = React.useRef(false);
  const mobileMenuRef = useFocusTrap(mobileOpen);
  useScrollLock(mobileOpen);

  const THRESHOLD_ON = 24;
  const THRESHOLD_OFF = 8;

  const navItems = [
    ["Publicaciones", "/#publicaciones"],
    ["Servicios", "/#servicios"],
    ["Opiniones", "/#opiniones"],
    ["Sobre mí", "/#sobre"],
    ["Contacto", "/#contacto"],
  ];

  const isActive = (href) => {
    if (href.startsWith("/#")) {
      return path === "/" && hash === href.slice(1);
    }
    return path === href;
  };

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
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    const onHash = () => setMobileOpen(false);

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
  const positionClass = scrolled ? "fixed top-0 left-0 right-0" : "sticky top-0";

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full ${positionClass} z-50 transition-all ${
          scrolled ? "shadow-sm border-b backdrop-blur-md" : ""
        }`}
        style={{
          background: scrolled ? "rgba(246,243,238,0.85)" : "var(--ivory)",
          borderColor: "var(--border-light)",
        }}
      >
        {/* Mobile Header */}
        <div
          className={`relative mx-auto max-w-[1400px] flex items-center justify-between px-5 md:px-10 ${topBarPadding} md:hidden`}
        >
          <Logo
            onNavigate={onNavigate}
            logoSize={logoSize}
            subTitleSize={subTitleSize}
          />

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border px-3 py-2 focus-ring"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{ borderColor: "var(--graphite)" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {mobileOpen && (
            <div
              ref={mobileMenuRef}
              className="absolute left-0 right-0 top-full md:hidden px-5 pb-4 border-t shadow-sm"
              style={{ background: "var(--ivory)", borderColor: "var(--border-light)" }}
            >
              <nav className="mt-2 grid gap-2 text-sm" aria-label="Navegación móvil">
                {navItems.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="transition-colors btn-sage w-full justify-between"
                    onClick={(e) => handleNavClick(e, href)}
                    aria-current={isActive(href) ? "page" : undefined}
                  >
                    {label} <ArrowRight size={16} />
                  </a>
                ))}
                <a
                  href="/#trabajos"
                  className="transition-colors btn-sage rounded-xl border px-3 py-2 inline-flex items-center gap-2 justify-center hover:bg-[var(--charcoal)] hover:text-white"
                  style={{
                    borderColor: "var(--charcoal)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                  onClick={(e) => handleNavClick(e, "/#trabajos")}
                >
                  Ver trabajos <ArrowRight size={16} />
                </a>
              </nav>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div
          className={`relative mx-auto max-w-[1400px] hidden md:flex items-center justify-between px-5 md:px-10 ${topBarPadding}`}
        >
          <Logo
            onNavigate={onNavigate}
            logoSize={logoSize}
            subTitleSize={subTitleSize}
          />

          <nav className="flex items-center gap-2 text-sm" aria-label="Navegación principal">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="transition-colors btn-sage focus-ring"
                onClick={(e) => handleNavClick(e, href)}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </a>
            ))}
            <a
              href="/#trabajos"
              className="transition-colors btn-sage rounded-full border px-3 py-1 inline-flex items-center gap-2 hover:bg-[var(--charcoal)] hover:text-white focus-ring"
              style={{
                borderColor: "var(--charcoal)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              onClick={(e) => handleNavClick(e, "/#trabajos")}
            >
              Ver trabajos <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <div
        aria-hidden="true"
        style={{ height: scrolled ? headerHeight : 0 }}
      />
    </>
  );
}

Header.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

/**
 * Logo Component
 * Reusable logo for header
 */
function Logo({ onNavigate, logoSize, subTitleSize }) {
  return (
    <a
      href="/#top"
      className="group inline-flex items-end gap-3 focus-ring rounded"
      aria-label="SG Estudio Creativo - Ir al inicio"
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
  );
}

Logo.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  logoSize: PropTypes.string.isRequired,
  subTitleSize: PropTypes.string.isRequired,
};

/**
 * Hero Component
 * Main hero section with highlight image
 */
function Hero() {
  return (
    <section
      className="relative px-5 md:px-10 md:mt-24 overflow-hidden"
      id="top"
    >
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {/* Desktop-only brand block */}
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
              className="text-sm md:text-base transition-colors btn-sage bg-[var(--charcoal)] text-white hover:bg-[var(--sage)] hover:text-white focus-ring"
            >
              Solicitar presupuesto
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-md">
          <img
            src={highlight}
            alt="Render destacado: Cocina Blanco Norte - Diseño de interiores moderno"
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

/**
 * Projects Section
 * Grid of project cards
 */
function Projects({ onNavigate }) {
  return (
    <section
      id="trabajos"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl tracking-wide">Trabajos seleccionados</h2>
        <a
          href="/#contacto"
          className="hidden md:inline-block text-sm underline btn-sage"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/#contacto");
          }}
        >
          ¿Tenés un proyecto? Conversemos
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-8">
        {projects.map((p) => (
          <ProjectCard
            key={p.slug}
            title={p.title}
            tag={p.tag}
            slug={p.slug}
            onNavigate={onNavigate}
          />
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
            style={{ borderColor: "var(--graphite)" }}
          >
            <div className="text-lg font-medium">{title}</div>
            <p className="opacity-80 mt-2 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

Projects.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

/**
 * Project Card Component
 */
function ProjectCard({ title, tag, slug, onNavigate }) {
  const pic = getPicture(slug, "portada");
  const [loaded, setLoaded] = React.useState(false);

  return (
    <article
      className="group rounded-3xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow"
      style={{ borderColor: "var(--border-light)" }}
    >
      <div className="relative aspect-[4/3]">
        {pic ? (
          <>
            <ResponsiveImage
              picture={pic}
              alt={`${title} - Portada del proyecto`}
              sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
              onLoad={() => setLoaded(true)}
            />
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
          className="text-xs md:text-sm opacity-90 transition-colors btn-sage focus-ring rounded"
          onClick={(e) => {
            e.preventDefault();
            const href = `/proyecto/${encodeURIComponent(decodeURIComponent(slug))}`;
            onNavigate(href);
          }}
          aria-label={`Ver proyecto: ${title}`}
        >
          Ver
        </a>
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

/**
 * Posts Section
 * Horizontal scrollable posts
 */
function Posts({ onNavigate }) {
  if (!posts || posts.length === 0) return null;

  const scrollerRef = React.useRef(null);
  const showArrows = posts.length > 3;

  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card="post"]');
    const step = card ? card.getBoundingClientRect().width + 24 : 360 + 24;
    el.scrollBy({ left: dir * step * 3, behavior: "smooth" });
  };

  return (
    <section
      id="publicaciones"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl tracking-wide">Publicaciones</h2>
        {showArrows && (
          <div className="hidden md:flex items-center gap-2">
            <button
              className="btn-sage px-3 py-1 rounded-full border focus-ring"
              style={{ borderColor: "var(--charcoal)" }}
              onClick={() => scrollByCards(-1)}
              aria-label="Publicaciones anteriores"
            >
              ←
            </button>
            <button
              className="btn-sage px-3 py-1 rounded-full border focus-ring"
              style={{ borderColor: "var(--charcoal)" }}
              onClick={() => scrollByCards(1)}
              aria-label="Publicaciones siguientes"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollerRef}
        className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "thin" }}
        role="region"
        aria-label="Lista de publicaciones"
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

Posts.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

/**
 * Post Card Component
 */
function PostCard({ post, onNavigate }) {
  const pic = getPostPicture(post.slug, post.cover || "cover");
  const [loaded, setLoaded] = React.useState(false);
  const newBadge = isNewPost(post?.date);

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm hover:shadow-lg transition-shadow"
      style={{ borderColor: "var(--border-light)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {pic ? (
          <ResponsiveImage
            picture={pic}
            alt={`${post.title} - Imagen de portada`}
            sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <PlaceholderImage label={post.title} />
        )}

        {!loaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: "#E6E2DA" }} />
        )}

        {newBadge && (
          <span
            className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full"
            style={{
              background: "var(--sage)",
              color: "white",
              boxShadow: "0 4px 10px -6px rgba(0,0,0,0.6)",
            }}
          >
            ¡Nuevo!
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3
            className="text-base md:text-lg leading-snug"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              minHeight: "3.5rem",
            }}
          >
            {post.title}
          </h3>
          {post.tag && (
            <p className="text-xs md:text-sm opacity-70">{post.tag}</p>
          )}
          {post.date && (
            <p className="text-xs opacity-50 mt-1">{formatDateES(post.date)}</p>
          )}
        </div>
        <a
          href={`/post/${encodeURIComponent(decodeURIComponent(post.slug))}`}
          className="self-end mt-4 text-xs md:text-sm opacity-90 transition-colors btn-sage focus-ring rounded"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(
              `/post/${encodeURIComponent(decodeURIComponent(post.slug))}`
            );
          }}
          aria-label={`Leer publicación: ${post.title}`}
        >
          Leer
        </a>
      </div>
    </article>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tag: PropTypes.string,
    cover: PropTypes.string,
    date: PropTypes.string,
  }).isRequired,
  onNavigate: PropTypes.func.isRequired,
};

/**
 * Testimonials Section
 */
function Testimonials() {
  return (
    <section
      id="opiniones"
      className="px-5 md:px-10 mt-20 md:mt-28 scroll-mt-24 md:scroll-mt-28"
    >
      <h2 className="text-2xl md:text-3xl tracking-wide">Opiniones</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="rounded-3xl border p-6 md:p-8"
            style={{ borderColor: "var(--graphite)" }}
          >
            <p className="text-sm md:text-base leading-relaxed">"{t.text}"</p>
            <footer className="mt-4 text-xs opacity-70">— {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

/**
 * About Section
 */
function About() {
  return (
    <section
      id="sobre"
      className="px-5 md:px-10 mt-20 md:mt-28 grid gap-10 items-start scroll-mt-24 md:scroll-mt-28 md:[grid-template-columns:280px_1fr]"
    >
      <div className="justify-self-center md:justify-self-start w-40 md:w-auto">
        <figure
          className="relative aspect-[3/4] w-40 md:w-[280px] rounded-3xl overflow-hidden border shadow-sm bg-white"
          style={{ borderColor: "var(--border-light)" }}
        >
          <img
            src={portrait}
            alt="Foto de Sol Gauna - Diseñadora de interiores"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            sizes="(min-width:768px) 280px, 160px"
          />
          <figcaption className="sr-only">
            Sol Gauna — Estudio Creativo
          </figcaption>
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

/**
 * Contact Section
 */
function Contact() {
  const [formData, setFormData] = React.useState({
    nombre: "",
    detalle: "",
  });
  const [touched, setTouched] = React.useState({
    nombre: false,
    detalle: false,
  });
  const [submitted, setSubmitted] = React.useState(false);

  const nameError = formData.nombre.trim().length < 2 ? "Ingresá tu nombre" : "";
  const detailError =
    formData.detalle.trim().length < 10
      ? "Contá un poco más (mín. 10 caracteres)"
      : "";
  const isValid = !nameError && !detailError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    const parts = [];
    if (formData.nombre.trim()) parts.push(`Hola, soy ${formData.nombre.trim()}.`);
    if (formData.detalle.trim()) parts.push(`Mi proyecto: ${formData.detalle.trim()}`);
    const text = parts.join("\n\n");
    const waUrl = createWhatsAppLink(text);
    window.open(waUrl, "_blank");
  };

  return (
    <section
      id="contacto"
      className="px-5 md:px-10 mt-20 md:mt-28 mb-24 scroll-mt-24 md:scroll-mt-28"
    >
      <div
        className="rounded-3xl border p-6 md:p-10"
        style={{ borderColor: "var(--graphite)" }}
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
                className="flex items-center gap-3 hover:opacity-70 transition-opacity focus-ring rounded"
              >
                <Mail size={18} /> solg.estudiocreativo@gmail.com
              </a>
              <a
                href="https://www.instagram.com/solg.estudiocreativo"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity focus-ring rounded"
              >
                <Instagram size={18} /> @solg.estudiocreativo
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 hover:opacity-70 transition-opacity focus-ring rounded"
              >
                <Phone size={18} /> +54 9 2914 44-1533
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=R%C3%ADo%20Medio%20657%2C%20Villa%20General%20Belgrano%2C%20C%C3%B3rdoba"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity focus-ring rounded"
              >
                <MapPin size={18} /> Río Medio 657, Villa General Belgrano,
                Córdoba · Atención online a todo el país
              </a>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                className={`w-full rounded-xl border px-4 py-3 bg-transparent focus-ring ${
                  (submitted || touched.nombre) && nameError
                    ? "border-red-500"
                    : "border-[var(--graphite)]"
                }`}
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, nombre: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                aria-invalid={(submitted || touched.nombre) && !!nameError}
                aria-describedby={nameError ? "nombre-error" : undefined}
              />
              {(submitted || touched.nombre) && nameError && (
                <div id="nombre-error" className="text-xs text-red-600 mt-1">
                  {nameError}
                </div>
              )}
            </div>

            <div>
              <textarea
                className={`w-full rounded-xl border px-4 py-3 min-h-[140px] bg-transparent focus-ring ${
                  (submitted || touched.detalle) && detailError
                    ? "border-red-500"
                    : "border-[var(--graphite)]"
                }`}
                placeholder="Contame brevemente tu proyecto"
                value={formData.detalle}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, detalle: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, detalle: true }))}
                aria-invalid={(submitted || touched.detalle) && !!detailError}
                aria-describedby={detailError ? "detalle-error" : undefined}
              />
              {(submitted || touched.detalle) && detailError && (
                <div id="detalle-error" className="text-xs text-red-600 mt-1">
                  {detailError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitted && !isValid}
              className={`justify-self-start inline-flex items-center gap-2 transition-colors focus-ring rounded ${
                submitted && !isValid ? "opacity-60 cursor-not-allowed" : ""
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

/**
 * Footer Component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full text-white border-t"
      style={{
        background: "var(--charcoal)",
        borderColor: "#FFFFFF22",
      }}
    >
      <div className="px-5 md:px-10 py-14 md:py-18 relative mx-auto max-w-[1400px]">
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
        </div>

        <div className="my-6" style={{ height: 1, background: "#FFFFFF1A" }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-xs md:text-sm opacity-90">
            Dirigido por <span className="font-medium">Sol Gauna</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity text-xs md:text-sm focus-ring rounded"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <Phone size={16} /> +54 9 2914 44-1533
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:solg.estudiocreativo@gmail.com"
              className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity text-xs md:text-sm focus-ring rounded"
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
              className="opacity-90 hover:opacity-100 transition-opacity focus-ring rounded"
              title="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          <div className="text-[11px] md:text-xs opacity-70">
            © {currentYear}{" "}
            <span className="brand-sg-xs">SG</span> estudio creativo — Todos los
            derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
