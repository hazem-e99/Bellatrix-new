// HeroSection.jsx

import React from "react";

import SEO from "../../SEO";

import { getVariantClasses } from "../../../utils/variantSystem";
import CTAButton from "../../CTAButton";

const HeroSection = ({
  heroContent: propsHeroContent,
  backgroundVideo: propsBackgroundVideo,
  ctaButton: propsCtaButton,
  data,
}) => {
  // PRIORITIZE props data over default data for real-time preview

  const heroContent = propsHeroContent ||
    data?.heroContent || {
      title: "Transform Your Career with Bellatrix Training",

      subtitle: "Professional ERP Education & Skills Development",

      description:
        "Master Bellatrix with comprehensive training programs designed for professionals at all levels.",
    };

  const backgroundVideo =
    propsBackgroundVideo ||
    data?.backgroundVideo ||
    "/Videos/training-hero.mp4";

  const ctaButton = propsCtaButton ||
    data?.ctaButton || {
      text: "Start Learning",

      variant: "primary",
    };

  // Debug logging for real-time updates

  console.log(" [TrainingHeroSection] Component received data:", {
    hasPropsHeroContent: !!propsHeroContent,

    propsHeroContent: propsHeroContent,

    hasPropsBackgroundVideo: !!propsBackgroundVideo,

    propsBackgroundVideo: propsBackgroundVideo,

    hasPropsCtaButton: !!propsCtaButton,

    propsCtaButton: propsCtaButton,

    hasData: !!data,

    data: data,

    finalHeroContent: heroContent,

    finalBackgroundVideo: backgroundVideo,

    finalCtaButton: ctaButton,

    timestamp: new Date().toISOString(),
  });

  // Debug logging for CTA button variant

  console.log(" [TrainingHeroSection] CTA Button Debug:", {
    ctaButton,

    variant: ctaButton?.variant,

    variantType: typeof ctaButton?.variant,

    hasCtaButton: !!ctaButton,
  });

  // Get variant classes for the CTA button

  const getButtonClasses = (variant) => {
    const baseClasses =
      "inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105";

    const variantClasses = getVariantClasses(variant);

    const finalClasses = `${baseClasses} ${variantClasses}`;

    console.log(" [TrainingHeroSection] Button Classes Debug:", {
      variant,

      variantClasses,

      finalClasses,
    });

    return finalClasses;
  };

  return (
    <>
      <SEO
        title="Bellatrix Training Hero | Professional ERP Education & Skills Development"
        description="Transform your career with Bellatrix training programs. Expert-led education covering ERP implementation, customization, and advanced system management for business success."
        keywords="Bellatrix training hero, NetSuite education programs, ERP training courses, NetSuite skill development, Oracle training certification, professional ERP education"
        ogTitle="Bellatrix Training - Professional ERP Education Programs"
        ogDescription="Master Bellatrix with comprehensive training programs. Expert-led education for implementation, customization, and advanced ERP management skills."
        ogImage="/images/netsuite-training-hero.jpg"
      />

      <header className="min-h-screen relative overflow-hidden pt-20">
        {/* Background Video and Effects */}

        <div
          className="absolute inset-0 w-full h-full"
          onContextMenu={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          style={{ userSelect: "none", WebkitUserSelect: "none" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            className="absolute inset-0 w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-[8s] ease-in-out pointer-events-none"
            style={{
              filter:
                "brightness(0.7) contrast(1.2) saturate(1.3) hue-rotate(10deg)",

              animation: "video-enhance 20s ease-in-out infinite",

              userSelect: "none",

              WebkitUserSelect: "none",
            }}
          >
            <source
              src={backgroundVideo || "/trainingHeroSectionTwo.mp4"}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* All the video overlay effects */}

          {/* ... (keep all the existing video effects) ... */}
        </div>

        {/* Content */}

        <div className="relative z-30 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white animate-slide-up">
                <span className="inline-block animate-text-glow">
                  {heroContent.title.split(" ")[0]}
                </span>{" "}
                <span className="inline-block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent animate-gradient-text">
                  {heroContent.title.split(" ")[1]}
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-gradient-text-reverse">
                  {heroContent.title.split(" ").slice(2).join(" ")}
                </span>
              </h1>
            </div>

            <div className="text-center mb-12">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto animate-fade-in">
                {heroContent.description}
              </p>

              {ctaButton && (
                <div className="mt-8">
                  <CTAButton
                    variant={ctaButton.variant || "primary"}
                    size="lg"
                    className={getButtonClasses(ctaButton.variant)}
                    modalConfig={{
                      title: heroContent.title || "Training Programs",
                      subtitle:
                        heroContent.subtitle ||
                        "Let's discuss your training needs",
                      icon: "",
                    }}
                  >
                    {ctaButton.text}
                  </CTAButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeroSection;
