import { useState, useEffect, useMemo } from "react";
import { getComponentPathFromId, loadComponent } from "../components/componentMap";

export const useComponentLoader = (components) => {
  const [loadedComponents, setLoadedComponents] = useState({});
  const [loading, setLoading] = useState(true);

  // Memoize the components key to prevent infinite loops
  // Only re-run when the actual component data changes (not just reference)
  const componentsKey = useMemo(() => {
    if (!components || components.length === 0) return '';
    return components
      .map(c => `${c.componentType}-${c.id || ''}-${c.isVisible}`)
      .join('|');
  }, [components]);

  useEffect(() => {
    // Reset immediately so old page's components don't flash as "Not Found"
    setLoadedComponents({});

    if (!components || components.length === 0) {
      setLoading(false);
      return;
    }

    const visibleComponents = components.filter(
      (section) => section.isVisible === true || section.isVisible === 1
    );

    if (visibleComponents.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const loadComponents = async () => {
      try {
        const componentPromises = visibleComponents.map(async (section, index) => {
          const componentPath = getComponentPathFromId(section.componentType);
          if (componentPath) {
            const Component = await loadComponent(componentPath);
            return { sectionId: `component-${index}`, Component, sectionData: section };
          }
          return { sectionId: `component-${index}`, Component: null, sectionData: section };
        });

        const loaded = await Promise.all(componentPromises);

        if (cancelled) return; // Navigation happened — discard stale results

        const componentMap = {};
        loaded.forEach(({ sectionId, Component, sectionData }) => {
          if (Component) {
            componentMap[sectionId] = { Component, sectionData };
          }
        });
        setLoadedComponents(componentMap);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadComponents();

    return () => { cancelled = true; };
  }, [componentsKey]); // Use memoized key instead of components array

  return { loadedComponents, loading };
};

