import { useState, useEffect, useRef, useMemo } from "react";
import { getComponentPathFromId, loadComponent } from "../components/componentMap";

export const useComponentLoader = (components) => {
  const [loadedComponents, setLoadedComponents] = useState({});
  const loadingRef = useRef(false);
  
  // Memoize the components key to prevent infinite loops
  // Only re-run when the actual component data changes (not just reference)
  const componentsKey = useMemo(() => {
    if (!components || components.length === 0) return '';
    return components
      .map(c => `${c.componentType}-${c.id || ''}-${c.isVisible}`)
      .join('|');
  }, [components]);

  useEffect(() => {
    // Prevent concurrent loading
    if (loadingRef.current) return;
    
    const loadComponents = async () => {
      if (!components || components.length === 0) {
        setLoadedComponents({});
        return;
      }

      const visibleComponents = components.filter(
        (section) => section.isVisible === true || section.isVisible === 1
      );

      if (visibleComponents.length === 0) {
        setLoadedComponents({});
        return;
      }

      loadingRef.current = true;
      
      try {
        const componentPromises = visibleComponents.map(async (section, index) => {
          const componentPath = getComponentPathFromId(section.componentType);
          if (componentPath) {
            const Component = await loadComponent(componentPath);
            return {
              sectionId: `component-${index}`,
              Component,
              sectionData: section,
            };
          }
          return {
            sectionId: `component-${index}`,
            Component: null,
            sectionData: section,
          };
        });

        const loaded = await Promise.all(componentPromises);
        const componentMap = {};
        loaded.forEach(({ sectionId, Component, sectionData }) => {
          if (Component) {
            componentMap[sectionId] = { Component, sectionData };
          }
        });
        setLoadedComponents(componentMap);
      } finally {
        loadingRef.current = false;
      }
    };

    loadComponents();
  }, [componentsKey]); // Use memoized key instead of components array

  return loadedComponents;
};

