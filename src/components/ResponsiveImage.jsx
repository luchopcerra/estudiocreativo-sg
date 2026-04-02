import { useState } from "react";
import PropTypes from "prop-types";

/**
 * ResponsiveImage Component
 * Renders a responsive image with multiple sources and a lazy-loaded fallback
 *
 * @param {Object} picture - Picture object from vite-imagetools with sources and img
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional classes for the img element
 * @param {string} sizes - Sizes attribute for responsive images
 * @param {boolean} eager - Whether to use eager loading instead of lazy
 * @param {Function} onLoad - Callback when image loads
 * @param {boolean} withFade - Whether to apply fade-in effect on load
 */
export function ResponsiveImage({
  picture,
  alt,
  className = "",
  sizes = "100vw",
  eager = false,
  onLoad,
  withFade = true,
}) {
  const [loaded, setLoaded] = useState(eager);

  if (!picture || !picture.img) {
    return (
      <div
        className={`bg-[var(--sage)]/20 animate-pulse ${className}`}
        aria-label={alt}
        role="img"
      />
    );
  }

  const sources = Array.isArray(picture.sources)
    ? picture.sources
    : picture.sources
      ? [picture.sources]
      : [];

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const imgClasses = [
    "w-full h-full object-cover transition-[filter,opacity] duration-500",
    withFade && !loaded ? "opacity-80 blur-[2px]" : "opacity-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <picture className="absolute inset-0">
      {sources.map((source, idx) => (
        <source
          key={source?.srcset || source?.src || idx}
          srcSet={source?.srcset || source?.src}
          type={source?.type}
          sizes={sizes}
        />
      ))}
      <img
        src={picture.img.src}
        alt={alt}
        className={imgClasses}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </picture>
  );
}

ResponsiveImage.propTypes = {
  picture: PropTypes.shape({
    sources: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    img: PropTypes.shape({
      src: PropTypes.string.isRequired,
    }),
  }),
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.string,
  eager: PropTypes.bool,
  onLoad: PropTypes.func,
  withFade: PropTypes.bool,
};

/**
 * PlaceholderImage Component
 * Shows a gradient placeholder when image is not available
 *
 * @param {string} label - Label to display on the placeholder
 */
export function PlaceholderImage({ label }) {
  return (
    <div className="w-full h-full relative">
      <div
        className="w-full h-full"
        style={{ background: "var(--gradient-sage)" }}
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

PlaceholderImage.propTypes = {
  label: PropTypes.string.isRequired,
};
