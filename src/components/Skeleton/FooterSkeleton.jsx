import React from "react";
import "../../styles/skeleton.css";

const FooterSkeleton = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            {/* Logo */}
            <div className="skeleton w-40 h-10 mb-6" />
            
            {/* Description */}
            <div className="skeleton skeleton-paragraph w-full mb-2" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <div className="skeleton skeleton-paragraph w-5/6 mb-6" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="skeleton w-10 h-10 rounded-full" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="skeleton w-24 h-6 mb-6" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton skeleton-text" style={{ width: `${50 + Math.random() * 40}%`, background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="skeleton w-20 h-6 mb-6" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton skeleton-text" style={{ width: `${50 + Math.random() * 40}%`, background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="skeleton w-28 h-6 mb-6" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="skeleton w-5 h-5 rounded" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
                  <div className="skeleton skeleton-text flex-1" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="skeleton w-64 h-4 mx-auto" style={{ background: 'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)', backgroundSize: '200% 100%' }} />
        </div>
      </div>
    </footer>
  );
};

export default FooterSkeleton;
