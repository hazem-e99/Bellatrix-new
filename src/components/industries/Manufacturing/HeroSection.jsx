import React from "react";
import SEO from "../../SEO";
import CTAButton from "../../CTAButton";

const HeroSection = (props) => {
  // PRIORITIZE props data over default data for real-time preview
  const ctaButton = props.ctaButton || props.data?.ctaButton;
  const title = props.title || props.data?.title;
  const subtitle = props.subtitle || props.data?.subtitle;
  const description = props.description || props.data?.description;
  const backgroundImage = props.backgroundImage || props.data?.backgroundImage;
  const backgroundVideo = props.backgroundVideo || props.data?.backgroundVideo;

  // Use form data directly with fallbacks
  const finalData = {
    title: title || "Manufacturing Solutions",
    subtitle: subtitle || "Streamline your manufacturing operations",
    description: description || "Comprehensive NetSuite solutions for manufacturing businesses",
    backgroundImage: backgroundImage || "/images/manufacturing-hero.jpg",
    backgroundVideo: backgroundVideo || "",
    ctaButton: ctaButton || {
      text: "Learn More",
      link: "/manufacturing",
      variant: "primary",
    },
  };

  // Debug logging for real-time updates
  console.log(" [ManufacturingHeroSection] Component received data:", {
    hasPropsData: !!(props.title || props.subtitle || props.data),
    props: props,
    finalData: finalData,
    timestamp: new Date().toISOString()
  });

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[var(--color-brand-dark-navy)]">
      <SEO
        title="Oracle NetSuite Manufacturing ERP Solutions | Transform Your Production"
        description="Streamline manufacturing operations with Oracle NetSuite ERP. Expert manufacturing consulting for production planning, inventory control, and operational efficiency."
        keywords="Oracle NetSuite manufacturing, manufacturing ERP, production management, NetSuite manufacturing solutions, manufacturing software, ERP consulting"
        ogTitle="Oracle NetSuite Manufacturing ERP Solutions | Professional Manufacturing Platform"
        ogDescription="Professional Oracle NetSuite manufacturing platform for comprehensive production management and operational excellence."
        ogImage="/images/manufacturing-hero.jpg"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--color-text-inverse)]">
          {finalData.title}
        </h1>
        <h2 className="text-2xl md:text-3xl text-[var(--color-text-inverse)] mb-6 font-semibold opacity-90">
          {finalData.subtitle}
        </h2>
        <p className="text-xl md:text-2xl text-[var(--color-text-inverse)] mb-8 leading-relaxed max-w-4xl mx-auto opacity-80">
          {finalData.description}
        </p>

        {/* CTA Button - now opens contact modal */}
        {finalData.ctaButton && (
          <div className="flex justify-center">
            <CTAButton
              variant={finalData.ctaButton.variant || "primary"}
              size="lg"
              className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
              modalConfig={{
                title: finalData.title || "Manufacturing Solutions",
                subtitle: finalData.description || "Let's discuss your manufacturing needs",
              }}
            >
              {finalData.ctaButton.text}
            </CTAButton>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeroSection;
