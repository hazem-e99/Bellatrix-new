import React from "react";
import "../../styles/skeleton.css";

const ShimmerBox = ({ className = "", style = {} }) => (
  <div
    className={`rounded ${className}`}
    style={{
      background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.08) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite linear',
      ...style
    }}
  />
);

const HeroSkeleton = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            animation: 'pulse 3s infinite'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            animation: 'pulse 3s infinite 1s'
          }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Content */}
          <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
            {/* Subtitle Badge */}
            <ShimmerBox className="h-8 w-56 rounded-full mx-auto lg:mx-0 mb-6" />

            {/* Title Lines */}
            <ShimmerBox className="h-14 w-full max-w-2xl mx-auto lg:mx-0 mb-4 rounded-lg" />
            <ShimmerBox className="h-14 w-4/5 max-w-xl mx-auto lg:mx-0 mb-8 rounded-lg" />

            {/* Description */}
            <ShimmerBox className="h-5 w-full max-w-lg mx-auto lg:mx-0 mb-3" />
            <ShimmerBox className="h-5 w-5/6 max-w-md mx-auto lg:mx-0 mb-10" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ShimmerBox className="h-14 w-48 rounded-xl" />
              <ShimmerBox className="h-14 w-40 rounded-xl" style={{ opacity: 0.6 }} />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <ShimmerBox className="h-12 w-24 mx-auto mb-3 rounded-lg" />
                <ShimmerBox className="h-4 w-16 mx-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {[1, 2, 3].map((item) => (
          <ShimmerBox
            key={item}
            className="w-3 h-3 rounded-full"
            style={{ opacity: item === 1 ? 1 : 0.4 }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 hidden md:block">
        <ShimmerBox className="w-14 h-14 rounded-full" />
      </div>
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 hidden md:block">
        <ShimmerBox className="w-14 h-14 rounded-full" />
      </div>
    </section>
  );
};

export default HeroSkeleton;
