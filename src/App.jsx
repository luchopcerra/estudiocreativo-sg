import React from "react";
import { Mail, Instagram, Phone, MapPin, ArrowRight } from "lucide-react";
import cocina from "./assets/work-samples/cocina.png";
import bano from "./assets/work-samples/bano.png";
import cocinaAntes from "./assets/work-samples/cocina-antes.png";
import cocinaDespues from "./assets/work-samples/cocina-despues.png";
import highlight from "./assets/work-samples/destacada.png";

const PALETTE = {
  sage: "#959c89", // verde salvia (banda)
  sageDark: "#86907E",
  ivory: "#F6F3EE", // fondo marfil
  charcoal: "#101010",
  graphite: "#2B2B2B",
};

const projects = [
  {
    title: "Cocina Blanco Norte",
    slug: "cocina-blanco-norte",
    tag: "Residencial",
    card: cocina, // imagen mostrada en la card
    // after: otraImagenCocina, // opcional: imagen distinta para "después"
    description:
      "La familia buscaba una cocina luminosa, con más espacio de guardado y un diseño limpio. Trabajamos en un layout funcional en L, materiales claros, iluminación puntual y generales cálidas, y optimizamos la mesada para preparación diaria.",
    before: cocinaAntes, // foto del "antes" (si existe)
    //after: cocinaDespues,
  },
  {
    title: "Baño Terrazo Gris",
    slug: "bano-terrazo-gris",
    tag: "Residencial",
    card: bano,
    // after: otraImagenBano, // opcional
    description:
      "El pedido fue modernizar el baño manteniendo la estructura. Propusimos revestimientos de inspiración terrazo gris, mueble a medida en madera natural, espejo con iluminación integrada y griferías negras para contraste.",
    before: "",
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
      <div className="relative mx-auto max-w-[1400px]">
        <Header />
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
  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-5 md:px-10 pt-6">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block" style={{ width: 0, height: 0 }} />
          <a
            href="#top"
            className="group inline-flex items-end gap-3"
            aria-label="SG Estudio Creativo"
          >
            <span className="font-black tracking-tight brand-sg-md text-[36px] md:text-[40px] leading-none">
              SG
            </span>
            <span className="leading-none">
              <span className="block text-[18px] md:text-[20px] tracking-[0.12em] lowercase">
                estudio creativo
              </span>
              <span className="block text-xs md:text-sm opacity-80 mt-1">
                diseño de interiores y arquitectura
              </span>
            </span>
          </a>
        </div>

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
            y atemporal. Renderes hiperrealistas, dirección de obra y
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
    <section id="trabajos" className="px-5 md:px-10 mt-20 md:mt-28">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl tracking-wide">
          Trabajos seleccionados
        </h2>
        <a
          href="#contacto"
          className="hidden md:inline-block text-sm underline"
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
            img={p.card || p.img}
            slug={p.slug}
          />
        ))}
      </div>

      <div
        id="servicios"
        className="mt-16 md:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
  const beforeSrc = project.before || null;
  const afterSrc = project.after || project.img || project.card;
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
    <section id="opiniones" className="px-5 md:px-10 mt-20 md:mt-28">
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
      className="px-5 md:px-10 mt-20 md:mt-28 grid md:grid-cols-[1fr,1.5fr] gap-10 items-center"
    >
      <div
        className="rounded-3xl overflow-hidden aspect-[4/5] border shadow-sm"
        style={{ borderColor: "#00000012" }}
      >
        <PlaceholderImage label="Retrato / Equipo" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl tracking-wide">Sobre mí</h2>
        <p className="mt-4 max-w-prose opacity-90 leading-relaxed">
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
          <li>• Modalidades: online en todo el país y presencial en AMBA.</li>
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contacto" className="px-5 md:px-10 mt-20 md:mt-28 mb-24">
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
                href="tel:+5491112345678"
                className="flex items-center gap-3 hover:opacity-70"
              >
                <Phone size={18} /> +54 9 11 1234 5678
              </a>
              <div className="flex items-center gap-3 opacity-80">
                <MapPin size={18} /> Buenos Aires (AMBA) · Atención online a
                todo el país
              </div>
            </div>
          </div>

          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="rounded-xl border px-4 py-3 bg-transparent"
                placeholder="Nombre"
              />
              <input
                className="rounded-xl border px-4 py-3 bg-transparent"
                placeholder="Email o teléfono"
              />
            </div>
            <input
              className="rounded-xl border px-4 py-3 bg-transparent"
              placeholder="Asunto"
            />
            <textarea
              className="rounded-xl border px-4 py-3 min-h-[140px] bg-transparent"
              placeholder="Contame brevemente tu proyecto"
            />
            <button
              type="submit"
              className="justify-self-start inline-flex items-center gap-2 transition-colors"
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
