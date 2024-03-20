// useIntersectionObserver.tsx

import { useEffect, useRef, useState } from "react";

type ReturnType = [
  (element: Element | null) => void,
  IntersectionObserverEntry | null,
];

interface Options extends IntersectionObserverInit {
  executeOnce?: boolean;
}

/**
 * A React Hook used to observe intersection changes with elements.
 * @param options
 */
function useIntersectionObserver({
  root = null,
  rootMargin = "0%",
  threshold = 0,
  executeOnce = false,
}: Options): ReturnType {

  const [ref, setRef] = useState<Element | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasExecuted = useRef(false);

  useEffect(
    () => {
      // Exit if the callback has already been executed while the element was intersected, 
      // if we don't have a reference to the element yet, or if the browser doesn't
      // support IntersectionObserver API.
      if (!ref || !window.IntersectionObserver || (executeOnce && hasExecuted.current)) return;
 
      // Create new Intersection Observer instance where it sets the entry state
      // when intersection changes are detected on screen.
      const observer = new IntersectionObserver(
        ([entry]) => {
          setEntry(entry);
 
          if (entry.isIntersecting && executeOnce) {
            observer.disconnect();
            hasExecuted.current = true;
          }
        },
        { root, rootMargin, threshold },
      );
 
      // Start observing element
      observer.observe(ref);
 
      // Cleanup function
      return () => {
        observer.disconnect();
      };
    },
    // Avoid excessive re-renders by converting threshold to a string.
    [root, rootMargin, JSON.stringify(threshold), ref, executeOnce],
  );

  return [setRef, entry];
}

export default useIntersectionObserver;
