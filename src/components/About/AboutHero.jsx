import React, { useRef, useState, useEffect } from "react";

const AboutHero = ({ 
  data,
  // Direct props for Page Builder
  title: propTitle,
  subtitle: propSubtitle,
  description: propDescription,
  ctaButtonText: propCtaButtonText,
  ctaButtonLink: propCtaButtonLink,
  backgroundVideo: propBackgroundVideo,
  backgroundImage: propBackgroundImage,
  stats: propStats,
}) => {
  const sectionRef = useRef(null);
  // Delay loading the video until after first paint so content renders fast
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Load the video only after browser is idle / first paint is done
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setVideoReady(true), { timeout: 2000 });
    } else {
      const t = setTimeout(() => setVideoReady(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  // Scroll to next section function
  const scrollToNextSection = () => {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Static fallback data (CMS data comes via props)
  const defaultData = {
    title: "About Bellatrix",
    subtitle: "Your trusted partner in digital transformation",
    description:
      "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",
    backgroundVideo: "/Videos/about-hero.mp4",
    stats: [
      { value: "500+", label: "Projects Completed" },
      { value: "15+", label: "Years Experience" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "200+", label: "Happy Clients" },
    ],
  };

  // PRIORITIZE direct props > data prop > default data for real-time preview
  const heroData = {
    title: propTitle || data?.title || defaultData?.title || "About Bellatrix",
    subtitle: propSubtitle || data?.subtitle || defaultData?.subtitle || "Your trusted partner in digital transformation",
    description: propDescription || data?.description || defaultData?.description ||
      "We are a leading consultancy firm specializing in NetSuite implementations, business process optimization, and technology solutions that drive growth and efficiency.",
    backgroundVideo: propBackgroundVideo || data?.backgroundVideo || defaultData?.backgroundVideo || "/Videos/about-hero.mp4",
    backgroundImage: propBackgroundImage || data?.backgroundImage || defaultData?.backgroundImage,
    ctaButtonText: propCtaButtonText || data?.ctaButtonText || defaultData?.ctaButtonText || "Discover Our Story",
    ctaButtonLink: propCtaButtonLink || data?.ctaButtonLink || defaultData?.ctaButtonLink || "/about",
    stats: (propStats && propStats.length > 0) ? propStats : (data?.stats || defaultData?.stats || [
      { value: "500+", label: "Projects Completed" },
      { value: "15+", label: "Years Experience" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "200+", label: "Happy Clients" },
    ]),
  };

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background: this image shows INSTANTLY while the video is still loading */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/about-hero-poster.jpg')" }}
      />

      {/* Video loads after first paint — fades over the poster image once ready */}
      {videoReady && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/about-hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
          onCanPlay={(e) => { e.currentTarget.style.opacity = "1"; }}
          style={{ willChange: "opacity" }}
        >
          <source
            src={heroData.backgroundVideo || "/Videos/about-hero.mp4"}
            type="video/mp4"
          />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary-dark)/0.8_0%,var(--color-gray-900)/0.6_50%,var(--color-cyan-900)/0.8_100%)]" />

      {/* Floating decorative elements — pure CSS so no JS overhead */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-xl opacity-20 bg-gradient-to-r from-purple-500 to-cyan-400"
          style={{ animation: "floatA 6s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full blur-lg opacity-20 bg-gradient-to-r from-red-600 to-cyan-500"
          style={{ animation: "floatB 8s ease-in-out infinite" }}
        />
      </div>

      {/* Content — visible immediately, no initial opacity:0 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto" style={{ animation: "fadeUp 0.7s ease both" }}>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
          {heroData.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed max-w-4xl mx-auto font-medium">
          {heroData.subtitle}
        </p>
        <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-3xl mx-auto">
          {heroData.description}
        </p>
        <button
          onClick={scrollToNextSection}
          className="theme-cta-button text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[linear-gradient(90deg,var(--color-primary),var(--color-cyan-600))] hover:scale-105 transform cursor-pointer inline-flex items-center gap-2"
        >
          {heroData.ctaButtonText || "Discover Our Story"}
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator — CSS animation */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        style={{ animation: "floatB 2s ease-in-out infinite" }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(10px) rotate(-5deg); }
        }
      `}</style>
    </section>
  );
};

export default AboutHero;
