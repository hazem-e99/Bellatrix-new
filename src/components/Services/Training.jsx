import React, { useState, useEffect } from "react";
import ContactForm from "../ContactForm";
import Modal from "../../components/Modal";
import CTAButton from "../CTAButton";
import { usePageData } from "../../hooks/useJsonServerData.jsx";
import TrainingHeroSection from "../Training/TrainingHeroSection";
import TrainingProgramsSection from "../Training/TrainingProgramsSection";
import ProgramDetailsModal from "../Training/ProgramDetailsModal";
import FeatureDetailsModal from "../Training/FeatureDetailsModal";

const Training = () => {
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Fetch data from JSON Server
  const { data, isLoading: loading } = usePageData("training");

  // Video Protection - Apply only to video elements
  useEffect(() => {
    const handleVideoContextMenu = (e) => {
      // Only prevent context menu on video elements
      if (e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    };

    const handleVideoDragStart = (e) => {
      // Only prevent drag on video elements
      if (e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    };

    const handleVideoSelectStart = (e) => {
      // Only prevent selection on video elements
      if (e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e) => {
      // Keep keyboard shortcuts disabled globally for dev tools protection
      if (e.keyCode === 123) {
        // F12
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        // Ctrl+Shift+I
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.keyCode === 85) {
        // Ctrl+U
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.keyCode === 83) {
        // Ctrl+S
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleVideoContextMenu);
    document.addEventListener("dragstart", handleVideoDragStart);
    document.addEventListener("selectstart", handleVideoSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleVideoContextMenu);
      document.removeEventListener("dragstart", handleVideoDragStart);
      document.removeEventListener("selectstart", handleVideoSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setIsProgramModalOpen(true);
  };

  const closeProgramModal = () => {
    setIsProgramModalOpen(false);
    setSelectedProgram(null);
  };

  const openFeatureModal = (feature) => {
    setSelectedFeature(feature);
    setIsFeatureModalOpen(true);
  };

  const closeFeatureModal = () => {
    setIsFeatureModalOpen(false);
    setSelectedFeature(null);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Error loading training data. Please try again later.
      </div>
    );
  }

  // Helper function to render SVG icons
  const renderIcon = (iconPath, className = "w-7 h-7 text-white") => {
    if (!iconPath || typeof iconPath !== "string") return null;

    // Remove any leading "M" if the path already starts with "M"
    const normalizedPath = iconPath.startsWith("M")
      ? iconPath.substring(1)
      : iconPath;
    const paths = normalizedPath.split(" M").filter(Boolean);

    return (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {paths.map((path, i) => (
          <path
            key={i}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={`M${path}`}
          />
        ))}
      </svg>
    );
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes bounceSubtle {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-3px);
                        }
                    }
                    
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s ease-out forwards;
                        opacity: 0;
                    }
                    
                    .animate-bounce-subtle {
                        animation: bounceSubtle 3s ease-in-out infinite;
                    }
                    
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-10px) rotate(2deg);
                        }
                    }
                    
                    @keyframes swing {
                        0%, 100% {
                            transform: rotate(0deg) scale(1);
                        }
                        25% {
                            transform: rotate(3deg) scale(1.02);
                        }
                        75% {
                            transform: rotate(-3deg) scale(1.02);
                        }
                    }
                    
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                    
                    .animate-swing {
                        animation: swing 6s ease-in-out infinite;
                    }

                    /* ... (keep all other existing animations) ... */

                    /* Custom Scrollbar Styles */
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(135deg, #2563eb, #06b6d4);
                        border-radius: 10px;
                        border: 2px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(135deg, #1d4ed8, #0891b2);
                        box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-corner {
                        background: rgba(255, 255, 255, 0.1);
                    }
                    
                    /* Firefox scrollbar */
                    .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #2563eb rgba(255, 255, 255, 0.1);
                    }
                `,
        }}
      />

      <div className="custom-scrollbar bg-[#001038]">
        {/* Hero Section with Video */}
        <TrainingHeroSection
          heroContent={data.heroContent}
          renderIcon={renderIcon}
        />

        {/* Our Training Programs Section */}
        <TrainingProgramsSection
          programsSection={data.programsSection}
          trainingPrograms={data.trainingPrograms}
          renderIcon={renderIcon}
          onProgramClick={openProgramModal}
        />

        {/* Key Training Modules Section */}
        <div className="py-12 bg-[#001038]">
          <div className="container mx-auto px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {data.keyModulesSection.title.split(" ")[0]}{" "}
                <span className="text-blue-400">
                  {data.keyModulesSection.title.split(" ").slice(1).join(" ")}
                </span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {data.keyModulesSection.description}
              </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.keyModules.map((module, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-gray-800 rounded-3xl p-6 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm"
                >
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {module.description}
                    </p>
                    <div className="text-xs text-blue-400 font-medium">
                      Duration: {module.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Our Training Section */}
        <div className="bg-gray-50 py-12 light-section">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            {(() => {
              const section = data.whyChooseSection || {};

              const rawTitle = section.title;
              const safeTitle =
                typeof rawTitle === "string" && rawTitle.trim().length > 0
                  ? rawTitle.trim()
                  : "Why Choose Our Training";

              const titleParts = safeTitle.split(/\s+/);
              const firstWord = titleParts[0] || "Why";
              const remainingWords =
                titleParts.slice(1).join(" ") || "Choose Our Training";

              const rawDescription = section.description;
              const safeDescription =
                typeof rawDescription === "string" &&
                rawDescription.trim().length > 0
                  ? rawDescription.trim()
                  : "Professional development excellence";

              const imageSrc = section.image || "/images/indleaders.jpg";

              const badgeText =
                section.Professional_Badge ||
                section.badge ||
                "Excellence Training";

              return (
                <>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                      {firstWord}{" "}
                      <span className="text-blue-600">{remainingWords}</span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                      {safeDescription}
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Features Grid - Left Side */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.trainingFeatures.map((feature, index) => (
                          <div
                            key={feature.id}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 p-8 animate-fade-in-up"
                            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                          >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                {feature.title}
                              </h3>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                {feature.shortDescription}
                              </p>
                              <button
                                onClick={() => openFeatureModal(feature)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-300 group-hover:translate-x-1 transform cursor-pointer hover:cursor-pointer"
                              >
                                Learn More
                                <svg
                                  className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image - Right Side */}
                    <div className="flex-1 flex justify-center">
                      <div className="relative group max-w-2xl">
                        {/* Advanced Background Effects */}
                        <div className="absolute -inset-8 opacity-30 group-hover:opacity-60 transition-all duration-700">
                          {/* Multiple layered glows */}
                          <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-2xl"></div>
                          <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/15 via-purple-500/20 to-cyan-500/15 rounded-2xl blur-xl"></div>
                          <div className="absolute -inset-2 bg-gradient-to-tr from-white/10 via-blue-300/20 to-white/10 rounded-xl blur-lg"></div>
                        </div>

                        {/* Professional Container with Multi-layer Design */}
                        <div className="relative bg-gradient-to-br from-gray-900/10 via-blue-900/5 to-gray-900/10 rounded-3xl p-6 backdrop-blur-md border border-white/30 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                          {/* Inner glow container */}
                          <div className="relative bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 rounded-2xl p-4 border border-white/20">
                            <img
                              src={imageSrc}
                              alt={`${safeTitle} - Professional Development Excellence`}
                              className="w-full h-auto rounded-xl shadow-2xl brightness-105 contrast-110 saturate-105 group-hover:brightness-110 group-hover:contrast-115 group-hover:saturate-110 transition-all duration-500 filter drop-shadow-xl"
                              onError={(e) => {
                                e.target.src = "/images/indleaders.jpg";
                              }}
                            />

                            {/* Professional overlay effects */}
                            <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-400/5 pointer-events-none"></div>
                            <div className="absolute inset-4 rounded-xl bg-gradient-to-bl from-transparent via-white/3 to-transparent pointer-events-none"></div>
                          </div>

                          {/* Advanced Floating Tech Elements */}
                          <div className="absolute top-3 right-3">
                            <div className="relative">
                              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse shadow-lg"></div>
                              <div className="absolute inset-0 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"></div>
                            </div>
                          </div>

                          <div className="absolute bottom-6 left-6">
                            <div className="relative">
                              <div className="w-3 h-3 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-pulse shadow-md"></div>
                              <div className="absolute -inset-1 w-5 h-5 bg-cyan-400/20 rounded-full animate-ping"></div>
                            </div>
                          </div>

                          <div className="absolute top-1/2 right-6">
                            <div className="relative">
                              <div className="w-2 h-2 bg-white/90 rounded-full animate-pulse shadow-sm"></div>
                              <div className="absolute -inset-1 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
                            </div>
                          </div>

                          <div className="absolute top-1/4 left-8">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full animate-pulse opacity-70"></div>
                          </div>

                          <div className="absolute bottom-1/3 right-12">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-white to-blue-200 rounded-full animate-pulse opacity-80"></div>
                          </div>

                          {/* Professional corner accents */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/40 rounded-tl-3xl"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/40 rounded-bl-3xl"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-3xl"></div>

                          {/* Data visualization lines */}
                          <div className="absolute top-4 left-1/4 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
                          <div className="absolute bottom-8 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"></div>
                          <div className="absolute top-1/3 right-2 w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-300/50 to-transparent"></div>
                        </div>

                        {/* Professional Badge */}
                        <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center space-x-2">
                            <span>{badgeText}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Program Details Modal */}
        <ProgramDetailsModal
          isOpen={isProgramModalOpen && selectedProgram}
          onClose={closeProgramModal}
          program={selectedProgram}
          renderIcon={renderIcon}
          onContactClick={openContactModal}
        />
        {/* Feature Details Modal */}
        <FeatureDetailsModal
          isOpen={isFeatureModalOpen && selectedFeature}
          onClose={closeFeatureModal}
          feature={selectedFeature}
          renderIcon={renderIcon}
          onContactClick={openContactModal}
        />
        {/* Contact Modal */}
        <Modal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          title="Contact Us"
          subtitle="Let's discuss your project needs"
        >
          <div className="p-2">
            <ContactForm onSuccess={closeContactModal} />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Training;
