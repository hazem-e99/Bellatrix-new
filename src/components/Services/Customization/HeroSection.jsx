import React from "react";

const HeroSection = ({ title, subtitle }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 relative z-10">
      <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text-inverse)] mb-4 tracking-tight drop-shadow-2xl">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-[var(--color-text-inverse)] mb-8 drop-shadow-lg">
        {subtitle}
      </p>
    </div>
  );
};

export default HeroSection;
