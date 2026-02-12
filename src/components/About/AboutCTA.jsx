import React from "react";
import CTAButton from "../CTAButton";

const AboutCTA = ({
  title,
  subtitle,
  description,
  ctaButton,
  features = [],
  data = {},
}) => {
  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "Ready to Build Something Great?",
    subtitle:
      "Let's collaborate to transform your business with innovative solutions that drive growth, efficiency, and success.",
    description:
      "Contact us today to discuss how we can help you optimize your operations and drive growth.",
    buttonText: "Start Consultation",
    buttonLink: null,
    features: [
      {
        icon: "",
        title: "Expert Team",
        description: "Certified professionals with deep industry knowledge",
      },
      {
        icon: "",
        title: "Proven Track Record",
        description: "Hundreds of successful implementations",
      },
      {
        icon: "",
        title: "Ongoing Support",
        description: "24/7 support to ensure your success",
      },
    ],
  };

  // PRIORITIZE props data over default data for real-time preview
  // Handle ctaButton which can be an object {text, link, variant} or a string
  const buttonText = typeof ctaButton === 'object' && ctaButton?.text 
    ? ctaButton.text 
    : (typeof ctaButton === 'string' ? ctaButton : null);
  const buttonLink = typeof ctaButton === 'object' && ctaButton?.link 
    ? ctaButton.link 
    : null;

  const finalData = {
    title: title || data?.title || defaultData?.title || "Ready to Build Something Great?",
    subtitle: subtitle || data?.subtitle || defaultData?.subtitle || "Let's collaborate to transform your business",
    description: description || data?.description || defaultData?.description || "Contact us today",
    buttonText: buttonText || data?.buttonText || defaultData?.buttonText || "Start Consultation",
    buttonLink: buttonLink || data?.buttonLink || defaultData?.buttonLink || null,
    features: features.length > 0 ? features : (data?.features || defaultData?.features || []),
  };

  return (
    <section className="py-20 bg-[var(--color-bg-secondary)] transition-colors duration-600 ease-in-out">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-text-primary)] transition-colors duration-600 ease-in-out">
            {finalData.title}
          </h2>
          <p className="text-xl mb-8 leading-relaxed text-[var(--color-text-secondary)] transition-colors duration-600 ease-in-out">
            {finalData.subtitle}
          </p>
          <p className="text-lg mb-12 text-[var(--color-text-secondary)] transition-colors duration-600 ease-in-out">
            {finalData.description}
          </p>

          {finalData.features && finalData.features.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {finalData.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon || ""}</div>
                  <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary)] transition-colors duration-600 ease-in-out">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] transition-colors duration-600 ease-in-out">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <CTAButton
            variant="primary"
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            modalConfig={{
              title: finalData.title || "Get Started",
              subtitle: finalData.subtitle || "Let's discuss your project requirements",
              icon: ""
            }}
          >
            {finalData.buttonText}
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
