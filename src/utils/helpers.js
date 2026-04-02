/**
 * Utility helper functions for SG Estudio Creativo
 */

/**
 * Creates a URL-friendly slug from a string
 * Normalizes to lowercase, removes accents and special characters
 *
 * @param {string} str - String to convert to slug
 * @returns {string} Normalized slug
 */
export function canonSlug(str) {
  try {
    str = decodeURIComponent(String(str));
  } catch {
    // If decoding fails, use string as-is
  }
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Parses a date string safely using UTC to avoid timezone issues
 * Supports formats like "2025-9-2" or "2025-09-02"
 *
 * @param {string} dateStr - Date string in format YYYY-M-D or YYYY-MM-DD
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export function parseDateUTC(dateStr) {
  if (!dateStr) return null;

  // Split by dash and parse components
  const parts = dateStr.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }

  const [year, month, day] = parts;
  // Create date in UTC (month is 0-indexed)
  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  // Validate the date is reasonable
  if (Number.isNaN(date.getTime())) return null;
  if (year < 2000 || year > 2100) return null;

  return date;
}

/**
 * Checks if a post is new (within last 7 days)
 *
 * @param {string} dateStr - Date string to check
 * @returns {boolean} True if post is within last 7 days
 */
export function isNewPost(dateStr) {
  const postDate = parseDateUTC(dateStr);
  if (!postDate) return false;

  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const diff = Date.now() - postDate.getTime();

  return diff >= 0 && diff < sevenDaysInMs;
}

/**
 * Formats a date for display in Spanish (Argentina)
 *
 * @param {string} dateStr - Date string to format
 * @returns {string|null} Formatted date or null if invalid
 */
export function formatDateES(dateStr) {
  const date = parseDateUTC(dateStr);
  if (!date) return null;

  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Preloads images for faster navigation
 *
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  if (!Array.isArray(imageUrls) || typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    if (!url) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "image";
    link.fetchPriority = "low";
    document.head.appendChild(link);
  });
}

/**
 * WhatsApp number for SG Estudio Creativo
 * Contact: +54 9 2914 44-1533
 */
export const WHATSAPP_NUMBER = "5492914441533";

/**
 * Creates a WhatsApp link with pre-filled message
 *
 * @param {string} message - Message to pre-fill
 * @returns {string} WhatsApp URL
 */
export function createWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
