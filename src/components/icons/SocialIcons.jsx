/**
 * Social Icons
 * SVG icons for social media platforms
 * Using inline SVG since lucide-react no longer includes brand icons
 */

/**
 * Instagram Icon
 * @param {number} size - Icon size in pixels (default: 24)
 * @param {string} className - Additional CSS classes
 * @param {React.CSSProperties} style - Additional styles
 */
export function Instagram({ size = 24, className = "", style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-label="Instagram"
      role="img"
    >
      <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
    </svg>
  );
}

/**
 * WhatsApp Icon
 * @param {number} size - Icon size in pixels (default: 24)
 * @param {string} className - Additional CSS classes
 * @param {React.CSSProperties} style - Additional styles
 */
export function WhatsApp({ size = 24, className = "", style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-label="WhatsApp"
      role="img"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.106-.473-.148-.673.149-.196.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.249-.463-2.377-1.468-1.879-1.676-3.074-4.717-3.143-5.044-.07-.326-.004-.475.148-.625.15-.15.347-.399.523-.6.176-.2.237-.325.336-.524.1-.2.05-.375-.025-.525-.075-.15-.672-1.62-.927-2.218-.244-.577-.487-.5-.672-.509l-.576-.01c-.198 0-.523.074-.797.374-.273.3-1.046 1.02-1.046 2.489 0 1.468 1.07 2.889 1.219 3.09.15.2 2.106 3.214 5.1 4.509.714.308 1.27.493 1.705.63.715.226 1.368.194 1.886.119.575-.082 1.758-.718 2.006-1.41.248-.694.248-1.29.173-1.414z" />
      <path d="M12.004 0C5.374 0 0 5.374 0 12.004c0 2.122.552 4.19 1.598 6.016L.552 23.68l5.86-1.038a11.934 11.934 0 0 0 17.592-10.64C23.998 5.384 18.624.01 11.994.01h.01z" />
    </svg>
  );
}
