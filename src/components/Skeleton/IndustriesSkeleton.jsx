import React from "react";
import "../../styles/skeleton.css";

// Light background shimmer
const Shimmer = ({ className = "", style = {} }) => (
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

const IndustriesSkeleton = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <Shimmer className="h-8 w-40 rounded-full mx-auto mb-6" />
          
          {/* Title */}
          <Shimmer className="h-10 w-80 max-w-full mx-auto mb-4 rounded-lg" />
          
          {/* Subtitle */}
          <Shimmer className="h-5 w-96 max-w-full mx-auto mb-2" />
          <Shimmer className="h-5 w-72 max-w-full mx-auto" />
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-700 shadow-lg"
            >
              {/* Image Skeleton */}
              <Shimmer className="h-48 w-full rounded-none" />

              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <Shimmer className="w-12 h-12 rounded-xl mb-4" />

                {/* Title */}
                <Shimmer className="h-7 w-3/4 mb-3 rounded-lg" />

                {/* Description */}
                <Shimmer className="h-4 w-full mb-2" />
                <Shimmer className="h-4 w-5/6 mb-4" />

                {/* Link */}
                <Shimmer className="h-5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSkeleton;
