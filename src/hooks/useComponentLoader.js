import { useState, useEffect, useRef, useMemo } from "react";
import { getComponentPathFromId, loadComponent } from "../components/componentMap";

export const useComponentLoader = (components) => {
  const [loadedComponents, setLoadedComponents] = useState({});
  // Track how many components have settled (loaded or failed)
  const settledRef = useRef(0);
  const totalRef = useRef(0);
  // Expose a "fully done" flag so callers can optionally wait
  const [allSettled, setAllSettled] = useState(false);

  const componentsKey = useMemo(() => {
    if (!components || components.length === 0) return '';
    return components
      .map(c => `${c.componentType}-${c.id || ''}-${c.isVisible}`)
      .join('|');
  }, [components]);

  useEffect(() => {
    // Reset immediately so old page's components don't flash as "Not Found"
    setLoadedComponents({});
    setAllSettled(false);
    settledRef.current = 0;

    if (!components || components.length === 0) {
      setAllSettled(true);
      return;
    }

    const visibleComponents = components.filter(
      (section) => section.isVisible === true || section.isVisible === 1
    );

    if (visibleComponents.length === 0) {
      setAllSettled(true);
      return;
    }

    totalRef.current = visibleComponents.length;
    let cancelled = false;

    // Load each component independently so the page renders progressively:
    // top sections appear immediately while lower ones are still fetching.
    visibleComponents.forEach(async (section, index) => {
      const sectionId = `component-${index}`;
      const componentPath = getComponentPathFromId(section.componentType);

      try {
        if (componentPath) {
          const Component = await loadComponent(componentPath);
          if (!cancelled && Component) {
            setLoadedComponents((prev) => ({
              ...prev,
              [sectionId]: { Component, sectionData: section },
            }));
          }
        }
      } catch {
        // loadComponent handles errors internally; nothing to do here
      } finally {
        if (!cancelled) {
          settledRef.current += 1;
          if (settledRef.current >= totalRef.current) {
            setAllSettled(true);
          }
        }
      }
    });

    return () => { cancelled = true; };
  }, [componentsKey]);

  return { loadedComponents, allSettled };
};

