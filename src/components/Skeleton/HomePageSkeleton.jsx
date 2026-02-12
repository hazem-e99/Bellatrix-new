import React from "react";
import HeroSkeleton from "./HeroSkeleton";
import ServicesSkeleton from "./ServicesSkeleton";
import IndustriesSkeleton from "./IndustriesSkeleton";
import TestimonialsSkeleton from "./TestimonialsSkeleton";
import "../../styles/skeleton.css";

// Shimmer animation component for consistent styling
const ShimmerBox = ({ className = "", style = {} }) => (
  <div
    className={`rounded ${className}`}
    style={{
      background: 'linear-gradient(90deg, #e2e8f0 0%, #f8fafc 50%, #e2e8f0 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite linear',
      ...style
    }}
  />
);

const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Services Section Skeleton */}
      <ServicesSkeleton />

      {/* Industries Section Skeleton */}
      <IndustriesSkeleton />

      {/* Testimonials Section Skeleton */}
      <TestimonialsSkeleton />
    </div>
  );
};

export default HomePageSkeleton;
