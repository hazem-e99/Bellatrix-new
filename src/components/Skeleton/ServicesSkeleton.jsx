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

const ServicesSkeleton = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <Shimmer className="h-8 w-40 rounded-full mx-auto mb-6" />
          
          {/* Title */}
          <Shimmer className="h-10 w-96 max-w-full mx-auto mb-4 rounded-lg" />
          
          {/* Subtitle */}
          <Shimmer className="h-5 w-80 max-w-full mx-auto mb-2" />
          <Shimmer className="h-5 w-64 max-w-full mx-auto" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              {/* Icon */}
              <Shimmer className="w-14 h-14 rounded-xl mb-6" />

              {/* Title */}
              <Shimmer className="h-7 w-3/4 mb-4 rounded-lg" />

              {/* Description */}
              <Shimmer className="h-4 w-full mb-2" />
              <Shimmer className="h-4 w-5/6 mb-2" />
              <Shimmer className="h-4 w-4/6 mb-6" />

              {/* Details List */}
              <div className="space-y-3 mb-6">
                {[1, 2, 3, 4].map((detail) => (
                  <div key={detail} className="flex items-center gap-3">
                    <Shimmer className="w-5 h-5 rounded-full flex-shrink-0" />
                    <Shimmer className="h-4 flex-1" style={{ width: `${55 + detail * 10}%` }} />
                  </div>
                ))}
              </div>

              {/* Stats Badge */}
              <Shimmer className="h-6 w-44 rounded-full mb-4" />

              {/* Link */}
              <Shimmer className="h-5 w-28" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Shimmer className="h-14 w-48 rounded-xl mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default ServicesSkeleton;
