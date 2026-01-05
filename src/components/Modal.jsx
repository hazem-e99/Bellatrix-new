import React from "react";

const Modal = ({ isOpen, onClose, icon, title, subtitle, children }) => {
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl relative shadow-2xl overflow-hidden animate-fade-in-up rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: 'var(--color-brand-dark-navy)' }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-blue-400/5 rounded-full blur-xl"></div>
        </div>

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/10">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white text-lg">{icon}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-white/70 text-sm mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-full flex-shrink-0"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 py-4">
          {children}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #22d3ee, #3b82f6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #67e8f9, #60a5fa);
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #22d3ee rgba(255, 255, 255, 0.05);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;
