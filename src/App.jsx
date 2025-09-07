import React from "react";
import { Mail, Instagram, MapPin, ArrowRight, Menu, X } from "lucide-react";
import highlight from "./assets/meta/destacada.webp";

const PALETTE = {
  sage: "#959c89", // verde salvia (banda)
  sageDark: "#86907E",
  ivory: "#F6F3EE", // fondo marfil
  charcoal: "#101010",
  graphite: "#2B2B2B",
};

// Contacto: número de WhatsApp centralizado (solo dígitos con prefijo país)
const WHATSAPP_NUMBER = "5492914441533";

// Carga dinámica de imágenes por slug/variante usando Vite
const imageUrls = import.meta.glob(
  "./assets/proyectos/*/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default", query: "?url" }
);
const IMAGES = Object.entries(imageUrls).reduce((acc, [path, url]) => {
  const parts = path.split("/"); // [".", "assets", "proyectos", slug, filename]
  const slug = parts[3];
  const filename = parts[4];
  const variant = filename.split(".")[0];
  acc[slug] = acc[slug] || {};
  acc[slug][variant] = url;
  return acc;
}, {});
const getImg = (slug, variant) => IMAGES?.[slug]?.[variant] || null;

const projects = [
  {
    title: "Cocina Blanco Norte",
    slug: "cocina-blanco-norte",
    tag: "Residencial",
    description:
      "La familia buscaba una cocina luminosa, con más espacio de guardado y un diseño limpio. Trabajamos en un layout funcional en L, materiales claros, iluminación puntual y generales cálidas, y optimizamos la mesada para preparación diaria.",
  },
  {
    title: "Baño Terrazo Gris",
    slug: "bano-terrazo-gris",
    tag: "Residencial",
    description:
      "El proyecto de la casa lo hizo otro estudio, pero en el diseño de interiores de este baño me metí de lleno con un solo objetivo: comprobar que los revestimientos que elegí funcionarían.\
​No se trataba solamente  de un render. Mi gran obsesión era ver cómo los colores y las texturas de esos materiales se veían en el espacio. Y este es el resultado de ese 'experimento'",
  },
  {
    title: "Cocina Comedor replanteo",
    slug: "replanteo-cocina-comedor",
    tag: "Residencial",
    card: "",
    description:
      "Remodelación integral de cocina. Transformación de un antiguo baño, lavadero y espacio residual en una cocina moderna, funcional y luminosa. Se optimizó la distribución, se diseñaron muebles a medida y se eligieron los materiales y acabados para crear el corazón del hogar.",
  },
  {
    title: "Baño Pequeño, Gran Estilo: Optimización y Diseño",
    slug: "bano-optimizado",
    tag: "Residencial",
    description:
      "Diseño de interiores para baño. Transformación de un espacio en obra gris en un ambiente funcional y estético. Nos enfocamos en la optimización de metros cuadrados y la elección estratégica de revestimientos, mobiliario y distribución para lograr un diseño moderno y práctico.",
  },
];

const testimonials = [
  {
    name: "María & Tomás",
    text: "Gran acompañamiento en decisiones y un resultado super luminoso y funcional. Recomendados.",
  },
  {
    name: "Valentina R.",
    text: "Interpretaron perfecto mi estilo. La obra quedó tal cual las visualizaciones que mostraron.",
  },
  {
    name: "Estudio D.",
    text: "Profesionales y prolijos. Excelente manejo de materiales y tiempos.",
  },
];

export default function App() {
  const [route, setRoute] = React.useState(window.location.hash || "");

  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // ruta detalle: #proyecto/<slug>
  const detailMatch = route.match(/^#proyecto\/(.+)$/);
  const detailSlug = detailMatch ? detailMatch[1] : null;
  const project = detailSlug
    ? projects.find((p) => p.slug === decodeURIComponent(detailSlug))
    : null;

  return (
    <div
      className="min-h-screen"
      style={{ background: PALETTE.ivory, color: PALETTE.charcoal }}
    >
      <Header />
      <div className="relative mx-auto max-w-[1400px]">
        {project ? (
          <ProjectDetail project={project} />
        ) : (
          <>
            <Hero />
            <Projects />
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

function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    const onHash = () => setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const topBarPadding = scrolled ? "py-2 md:py-3" : "py-4 md:py-6";
  const logoSize = scrolled
    ? "text-[32px] md:text-[36px]"
    : "text-[36px] md:text-[40px]";
  const subTitleSize = scrolled
    ? "text-[16px] md:text-[18px]"
    : "text-[18px] md:text-[20px]";

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all ${
        scrolled ? "shadow-sm border-b backdrop-blur-md" : ""
      }`}
      style={{
        background: scrolled ? "rgba(246,243,238,0.85)" : PALETTE.ivory,
        borderColor: "#00000012",
      }}
    >
      <div
        className={`relative mx-auto max-w-[1400px] flex items-center justify-between px-5 md:px-10 ${topBarPadding}`}
      >
        <a
          href="#top"
          className="group inline-flex items-end gap-3"
          aria-label="SG Estudio Creativo"
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {[
            ["Servicios", "#servicios"],
            ["Opiniones", "#opiniones"],
            ["Sobre mí", "#sobre"],
            ["Contacto", "#contacto"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="transition-colors btn-sage">
              {label}
            </a>
          ))}
          <a
            href="#trabajos"
            className="transition-colors btn-sage rounded-full border px-3 py-1 inline-flex items-center gap-2 hover:bg-[var(--charcoal)] hover:text-white"
            style={{
              borderColor: PALETTE.charcoal,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            Ver trabajos <ArrowRight size={16} />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          style={{ borderColor: PALETTE.graphite }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Mobile dropdown */}
        {open && (
          <div
            className="absolute left-0 right-0 top-full md:hidden px-5 pb-4 border-t shadow-sm"
            style={{ background: PALETTE.ivory, borderColor: "#00000012" }}
          >
            <nav className="mt-2 grid gap-2 text-sm">
              {[
                ["Servicios", "#servicios"],
                ["Opiniones", "#opiniones"],
                ["Sobre mí", "#sobre"],
                ["Contacto", "#contacto"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="transition-colors btn-sage w-full justify-between"
                  onClick={() => setOpen(false)}
                >
                  {label} <ArrowRight size={16} />
                </a>
              ))}
              <a
                href="#trabajos"
                className="transition-colors btn-sage rounded-xl border px-3 py-2 inline-flex items-center gap-2 justify-center hover:bg-[var(--charcoal)] hover:text-white"
                style={{
                  borderColor: PALETTE.charcoal,
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onClick={() => setOpen(false)}
              >
                Ver trabajos <ArrowRight size={16} />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-5 md:px-10 mt-14 md:mt-24" id="top">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="flex items-end gap-6">
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
          href="#contacto"
          className="hidden md:inline-block text-sm underline btn-sage"
        >
          ¿Tenés un proyecto? Conversemos
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-8">
        {projects.map((p, i) => (
          <ProjectCard
            key={i}
            title={p.title}
            tag={p.tag}
            img={getImg(p.slug, "portada")}
            slug={p.slug}
          />
        ))}
      </div>

      <div
        id="servicios"
        className="mt-16 md:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24 md:scroll-mt-28"
      >
        {[
          [
            "Diseño integral",
            "Desde concepto, materiales y layout, hasta documentación.",
          ],
          [
            "Render hiperrealista",
            "Visualizaciones fieles para decidir con confianza.",
          ],
          [
            "Dirección de obra",
            "Coordinación con gremios y control de calidad.",
          ],
        ].map(([title, desc]) => (
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

function ProjectCard({ title, tag, img, slug }) {
  return (
    <article
      className="group rounded-3xl overflow-hidden border shadow-sm"
      style={{ borderColor: "#00000012" }}
    >
      <div className="relative aspect-[4/3]">
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
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
          href={`#proyecto/${slug}`}
          className="text-xs md:text-sm opacity-90 transition-colors btn-sage"
        >
          Ver
        </a>
      </div>
    </article>
  );
}

function ProjectDetail({ project }) {
  const beforeSrc = getImg(project.slug, "antes");
  const afterSrc =
    getImg(project.slug, "despues") || getImg(project.slug, "portada");
  return (
    <section className="px-5 md:px-10 mt-14 md:mt-20 mb-16">
      <a href="#trabajos" className="text-sm underline opacity-80">
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
          {beforeSrc ? (
            <img
              src={beforeSrc}
              alt={`${project.title} - Antes`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
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
          <img
            src={afterSrc}
            alt={`${project.title} - Después`}
            className="w-full h-full object-cover"
          />
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
      className="px-5 md:px-10 mt-20 md:mt-28 grid gap-10 items-center scroll-mt-24 md:scroll-mt-28"
    >
      <div>
        <h2 className="text-2xl md:text-3xl tracking-wide">Sobre mí</h2>
        <p className="mt-4 opacity-90 leading-relaxed">
          Soy Sol, diseñadora de interiores. Creo espacios equilibrados,
          luminosos y humanos. Trabajo con una metodología clara: relevamiento,
          anteproyecto, selección de materiales, visualizaciones hiperrealistas
          y ejecución.
        </p>
        <ul className="mt-6 space-y-2 text-sm opacity-90">
          <li>• Enfoque: calidez, funcionalidad, atemporalidad.</li>
          <li>
            • Entregables: planos, renders, lista de compras y presupuesto.
          </li>
          <li>
            • Modalidades: online en todo el país y presencial en VGB y
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
                <WhatsAppIcon size={18} /> +54 9 2914 44-1533
              </a>
              <div className="flex items-center gap-3 opacity-80">
                <MapPin size={18} /> Villa General Belgrano, Córdoba · Atención
                online a todo el país
              </div>
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

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5A8.5 8.5 0 0012 3a8.5 8.5 0 00-8.5 8.5c0 1.8.5 3.6 1.5 5.1L5 21l4.6-1.2A8.4 8.4 0 0012 20.5c4.7 0 8.5-3.8 8.5-8.5z" />
      <path d="M15.1 14.1c-.3.6-1.1 1-1.6 1.1-.4.1-.8.1-1.8-.2-1.6-.4-3-1.7-3.3-2-.3-.3-1-1.1-1-2 0-.9.5-1.4.7-1.6.2-.2.4-.3.6-.3.2 0 .4 0 .6.01.2.01.4-.05.6.3.2.36.7 1.2.8 1.3.1.1.2.2.1.35-.1.15-.1.2-.2.33-.1.12-.2.26-.3.35-.1.1-.2.2-.08.4.12.2.5.75 1 1.2.7.6 1.3.8 1.6.9.3.1.5.08.7-.05.2-.12.6-.64.8-.85.2-.22.4-.18.7-.1.28.08 1.1.5 1.3.6.2.1.3.16.36.26.06.1.06.55-.1 1.1z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[var(--charcoal)] text-white">
      <div className="px-5 md:px-10 py-16 md:py-20 relative mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
          <div className="flex items-center gap-4">
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
            <div className="text-xs opacity-80">
              © {new Date().getFullYear()}{" "}
              <span className="brand-sg-xs">SG</span> estudio creativo — Todos
              los derechos reservados
            </div>
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
