import React from 'react';

const KeyModules = ({ keyModulesSection, keyModules }) => {
  return (
    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {keyModulesSection.title.split(' ')[0]} <span className="text-blue-400">{keyModulesSection.title.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
          {keyModulesSection.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {keyModules.map((module, index) => (
          <div key={index} className="group relative overflow-hidden bg-gray-800 rounded-3xl p-6 border border-gray-600/50 shadow-2xl hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
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
  );
};

export default KeyModules;
