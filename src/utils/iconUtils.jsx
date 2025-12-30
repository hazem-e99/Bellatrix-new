// Utility to render icon from name or SVG path
import * as HeroiconsOutline from "@heroicons/react/24/outline";

/**
 * Maps icon name to Heroicon component or renders SVG path
 * Supports both new format (icon name like "AcademicCap") and legacy format (SVG path)
 */
export const getIconComponent = (iconValue) => {
  if (!iconValue) return null;
  
  // Check if it's a Heroicon name (PascalCase, no spaces, no special SVG chars)
  const isIconName = /^[A-Z][a-zA-Z0-9]+$/.test(iconValue) && !iconValue.includes(" ");
  
  if (isIconName) {
    const iconName = `${iconValue}Icon`;
    const IconComponent = HeroiconsOutline[iconName];
    return IconComponent || null;
  }
  
  // Legacy: it's an SVG path string
  return null;
};

/**
 * Renders either a Heroicon component or legacy SVG path
 */
export const renderIcon = (iconValue, className = "w-6 h-6") => {
  if (!iconValue) return null;
  
  const IconComponent = getIconComponent(iconValue);
  
  if (IconComponent) {
    // It's a Heroicon component
    return <IconComponent className={className} />;
  }
  
  // Legacy SVG path format
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={iconValue}
      />
    </svg>
  );
};

export default renderIcon;
