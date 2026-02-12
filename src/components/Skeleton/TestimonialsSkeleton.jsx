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

const TestimonialsSkeleton = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <Shimmer className="h-8 w-44 rounded-full mx-auto mb-6" />
          
          {/* Title */}
          <Shimmer className="h-10 w-72 max-w-full mx-auto mb-4 rounded-lg" />
          
          {/* Subtitle */}
          <Shimmer className="h-5 w-80 max-w-full mx-auto" />
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                {/* Quote Icon */}
                <Shimmer className="w-12 h-12 rounded-xl mb-6" />

                {/* Quote Text */}
                <div className="space-y-3 mb-8">
                  <Shimmer className="h-4 w-full" />
                  <Shimmer className="h-4 w-full" />
                  <Shimmer className="h-4 w-5/6" />
                  <Shimmer className="h-4 w-4/6" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Shimmer key={star} className="w-5 h-5 rounded" />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Shimmer className="w-14 h-14 rounded-full" />
                  
                  {/* Name & Title */}
                  <div className="flex-1">
                    <Shimmer className="h-5 w-32 mb-2 rounded" />
                    <Shimmer className="h-4 w-24 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Shimmer className="w-12 h-12 rounded-full" />
          </div>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Shimmer className="w-12 h-12 rounded-full" />
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2, 3, 4, 5].map((dot) => (
            <Shimmer key={dot} className="w-3 h-3 rounded-full" style={{ opacity: dot === 1 ? 1 : 0.5 }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
