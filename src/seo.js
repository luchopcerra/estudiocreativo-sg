export const SITE_URL = "https://estudiocreativo-sg.com";
export const SITE_NAME = "SG Estudio Creativo";
export const DEFAULT_TITLE =
  "SG Estudio Creativo - Diseno de Interiores y Arquitectura";
export const DEFAULT_DESCRIPTION =
  "SG Estudio Creativo de Sol Gauna: diseno de interiores y arquitectura en Villa General Belgrano (Cordoba). Proyectos residenciales y comerciales con enfoque funcional, calido y atemporal.";
export const DEFAULT_IMAGE = `${SITE_URL}/og_image.webp`;

const decodeSlug = (slug) => {
  try {
    return decodeURIComponent(String(slug));
  } catch {
    return String(slug);
  }
};

export const canonSlug = (slug) =>
  decodeSlug(slug)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const routePath = (type, slug) =>
  `/${type}/${encodeURIComponent(canonSlug(slug))}`;

export const buildSeo = ({ type = "home", item = null } = {}) => {
  if (type === "project" && item) {
    const path = routePath("proyecto", item.slug);
    return {
      title: `${item.title} - ${SITE_NAME}`,
      description: item.description || DEFAULT_DESCRIPTION,
      canonical: `${SITE_URL}${path}`,
      url: `${SITE_URL}${path}`,
      image: DEFAULT_IMAGE,
      type: "article",
    };
  }

  if (type === "post" && item) {
    const path = routePath("post", item.slug);
    return {
      title: `${item.title} - ${SITE_NAME}`,
      description: item.summary || item.description || DEFAULT_DESCRIPTION,
      canonical: `${SITE_URL}${path}`,
      url: `${SITE_URL}${path}`,
      image: DEFAULT_IMAGE,
      type: "article",
      publishedTime: item.date || undefined,
    };
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    url: `${SITE_URL}/`,
    image: DEFAULT_IMAGE,
    type: "website",
  };
};

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  founder: {
    "@type": "Person",
    name: "Sol Gauna",
  },
  url: `${SITE_URL}/`,
  image: DEFAULT_IMAGE,
  areaServed: "Argentina",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rio Medio 657",
    postalCode: "X5194",
    addressLocality: "Villa General Belgrano",
    addressRegion: "Cordoba",
    addressCountry: "AR",
  },
  sameAs: ["https://www.instagram.com/solg.estudiocreativo"],
  telephone: "+54 9 2914 44-1533",
  email: "solg.estudiocreativo@gmail.com",
};

export const routeSchema = ({ type, item, seo }) => {
  if (type === "project") {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: item.title,
      description: item.description,
      url: seo.url,
      image: seo.image,
      creator: businessSchema,
    };
  }

  if (type === "post") {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: item.title,
      description: seo.description,
      datePublished: item.date,
      url: seo.url,
      image: seo.image,
      author: {
        "@type": "Person",
        name: "Sol Gauna",
      },
      publisher: businessSchema,
    };
  }

  return businessSchema;
};
