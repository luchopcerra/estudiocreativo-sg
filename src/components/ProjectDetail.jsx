import { useState, lazy } from "react";
import PropTypes from "prop-types";
import { ResponsiveImage, PlaceholderImage } from "./ResponsiveImage";

// Lazy load dependencies for preloading
const preloaderPromise = import("../utils/helpers").then((m) => m.preloadImages);

/**
 * ProjectDetail Component
 * Displays a single project with before/after images
 *
 * @param {Object} project - Project data
 * @param {Function} getPicture - Function to get picture data by slug and variant
 */
export function ProjectDetail({ project, getPicture }) {
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);

  const beforePic = getPicture?.(project?.slug, "antes");
  const afterPic =
    getPicture?.(project?.slug, "despues") || getPicture?.(project?.slug, "portada");

  const handleBack = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/#trabajos");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <article className="px-5 md:px-10 mt-14 md:mt-20 mb-16 fade-in">
      <nav aria-label="Navegación de proyecto">
        <a
          href="/#trabajos"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm underline opacity-80 hover:opacity-100 transition-opacity focus-ring rounded"
          aria-label="Volver a trabajos"
        >
          <span aria-hidden="true">←</span> Volver
        </a>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl md:text-3xl tracking-wide">{project.title}</h1>
        <p className="opacity-90 mt-3 max-w-prose text-sm md:text-base">{project.description}</p>
      </header>

      <figure className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
        {/* Before Image */}
        <figure
          className="rounded-3xl overflow-hidden border shadow-sm bg-white relative"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div className="relative aspect-[4/3]">
            {beforePic ? (
              <>
                <ResponsiveImage
                  picture={beforePic}
                  alt={`${project.title} - Antes`}
                  sizes="(min-width:768px) 50vw, 100vw"
                  onLoad={() => setBeforeLoaded(true)}
                />
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
          </div>
          <figcaption className="px-4 py-2 text-xs opacity-70">El antes</figcaption>
        </figure>

        {/* After Image */}
        <figure
          className="rounded-3xl overflow-hidden border shadow-sm bg-white relative"
          style={{ borderColor: "var(--border-light)" }}
        >
          <div className="relative aspect-[4/3]">
            {afterPic ? (
              <>
                <ResponsiveImage
                  picture={afterPic}
                  alt={`${project.title} - Después`}
                  sizes="(min-width:768px) 50vw, 100vw"
                  onLoad={() => setAfterLoaded(true)}
                />
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
          </div>
          <figcaption className="px-4 py-2 text-xs opacity-70">El después</figcaption>
        </figure>
      </figure>
    </article>
  );
}

ProjectDetail.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  getPicture: PropTypes.func.isRequired,
};
