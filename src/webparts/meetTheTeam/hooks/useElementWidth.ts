import * as React from 'react';

/**
 * Measures the width of an element (the web part itself, not the browser window).
 * SharePoint columns and the property pane change the web part width, so media queries are not enough.
 */
export function useElementWidth<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref: React.RefObject<T> = React.useRef<T>(null);
  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const element: T | null = ref.current;
    if (!element) {
      return undefined;
    }
    setWidth(element.getBoundingClientRect().width);

    const observer: ResizeObserver = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
