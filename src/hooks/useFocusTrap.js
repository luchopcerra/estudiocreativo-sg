import { useEffect, useRef, useCallback } from "react";

/**
 * useFocusTrap Hook
 * Traps focus within a container element when active (useful for modals, menus)
 *
 * @param {boolean} isActive - Whether the focus trap is active
 * @returns {React.RefObject} ref to attach to the container element
 */
export function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  const getFocusableElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];

    return Array.from(
      container.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="number"], input[type="search"], input[type="password"], input[type="submit"], input:not([type]), select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        !el.getAttribute("aria-hidden") &&
        el.offsetParent !== null
    );
  }, []);

  const trapFocus = useCallback(
    (event) => {
      if (!isActive || !containerRef.current) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [isActive, getFocusableElements]
  );

  useEffect(() => {
    if (!isActive) return;

    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement;

    // Focus first element after a short delay (for render completion)
    const timeoutId = setTimeout(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 50);

    // Add event listener
    document.addEventListener("keydown", trapFocus);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("keydown", trapFocus);
      // Restore previous focus
      previouslyFocusedElement.current?.focus?.();
    };
  }, [isActive, trapFocus, getFocusableElements]);

  return containerRef;
}

/**
 * useScrollLock Hook
 * Locks/unlocks body scroll when active (useful for modals, menus)
 *
 * @param {boolean} isLocked - Whether body scroll should be locked
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
}
