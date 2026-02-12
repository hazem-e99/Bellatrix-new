// Skeleton Components Index
export { default as HeroSkeleton } from "./HeroSkeleton";
export { default as ServicesSkeleton } from "./ServicesSkeleton";
export { default as IndustriesSkeleton } from "./IndustriesSkeleton";
export { default as TestimonialsSkeleton } from "./TestimonialsSkeleton";
export { default as FooterSkeleton } from "./FooterSkeleton";
export { default as HomePageSkeleton } from "./HomePageSkeleton";

// Generic Skeleton building blocks
export const SkeletonBox = ({ className = "", width, height, rounded = "rounded" }) => (
  <div
    className={`skeleton ${rounded} ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton skeleton-paragraph"
        style={{ width: i === lines - 1 ? "70%" : "100%" }}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`skeleton-card ${className}`}>
    <div className="skeleton skeleton-image h-40 mb-4" />
    <div className="skeleton skeleton-subtitle w-3/4 mb-3" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonAvatar = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };
  return <div className={`skeleton rounded-full ${sizes[size]} ${className}`} />;
};

export const SkeletonButton = ({ width = "w-32", className = "" }) => (
  <div className={`skeleton skeleton-button ${width} ${className}`} />
);
