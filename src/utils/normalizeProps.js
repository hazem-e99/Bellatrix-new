import { validateVariant } from "./variantSystem";

/**
 * Helper function to clean corrupted data that has numeric string keys
 * This happens when a string is accidentally spread into an object
 * Example: {...componentType} where componentType = "ManufacturingCaseStudies"
 * Results in: {"0": "M", "1": "a", "2": "n", ...}
 */
const cleanCorruptedData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const cleaned = {};
  for (const key in data) {
    // Skip numeric string keys that come from spread strings
    if (/^\d+$/.test(key)) {
      continue;
    }
    cleaned[key] = data[key];
  }
  return cleaned;
};

/**

 * Normalizes JSON data to match component prop expectations

 * This function maps JSON stru      ctaButton: data.ctaButton || data.hero?.ctaButton || {

        text: "Get Started",

        link: "/training",

        variant: validateVariant("primary")

      }, keys to the correct prop names that components expect

 */

const normalizeGenericCTA = (data, defaultTitle) => {
  const baseData = data.data || data;
  const features = baseData.features || baseData.items || data.features || data.items || [];
  
  const btnText = 
    baseData.buttonText || 
    baseData.ctaButton?.text || 
    (typeof baseData.ctaButton === 'string' ? baseData.ctaButton : null) || 
    data.buttonText || 
    data.ctaButton?.text || 
    "Get Started";

  return {
    ...baseData,
    title: baseData.title || data.title || defaultTitle || "Ready to Transform?",
    subtitle: baseData.subtitle || data.subtitle || "Let's discuss your needs",
    description: baseData.description || data.description || "",
    features: Array.isArray(features) ? features : [],
    ctaButton: {
        text: btnText,
        link: baseData.ctaButton?.link || baseData.buttonLink || null,
        variant: baseData.ctaButton?.variant || "primary"
    },
    // Include data wrapper for compatibility and pass through original fields
    data: { ...baseData, features: Array.isArray(features) ? features : [] } 
  };
};

/**

 * Normalizes props for different component types based on their expected prop structure

 * @param {string} componentType - The type of component (e.g., 'IntegrationTypesSection')

 * @param {Object} contentJson - The parsed JSON data from the backend

 * @returns {Object} - Normalized props that match component expectations

 */

export const normalizeProps = (componentType, contentJson) => {

  if (!contentJson || typeof contentJson !== "object") {

    console.warn(

      `normalizeProps: Invalid contentJson for ${componentType}:`,

      contentJson

    );

    return {};

  }

  // Clean corrupted data (numeric keys from spread strings)
  const cleanedData = cleanCorruptedData(contentJson);

  console.log(

    ` [normalizeProps] Processing ${componentType} with data:`,

    cleanedData

  );



  // Component-specific normalization mappings

  const componentMappings = {

    // Home Hero Section
    HeroSection: (data) => {
      console.log(" [HeroSection] Raw form data:", data);
      
      let slides = data.slides;
      if (!slides || !Array.isArray(slides) || slides.length === 0) {
          slides = [{
             title: data.title || "Welcome",
             subtitle: data.subtitle || "",
             description: data.description || data.content || "",
             video: data.video || data.backgroundVideo || "/Videos/implementation/homepage_hero.mp4"
          }];
      }

      return {
        slides: slides,
        stats: Array.isArray(data.stats) ? data.stats : [],
        data: { ...data, slides }
      };
    },


    // HR Hero Section
    HRHeroSection: (data) => {
      return {
        hero: {
          title: data.title || "Modern HR, Payroll & People Management",
          subtitle: data.subtitle || "Automate HR, empower employees, and stay compliant—on one secure platform designed for the future of work.",
          bgVideo: data.bgVideo || data.backgroundImage || "/Videos/hrVideo.mp4",
          bgColor: data.bgColor || "bg-gradient-to-br from-[#191970] via-black to-blue-700",
        }
      };
    },

    // About Team Section
    AboutTeam: (data) => {
       const members = data.members || data.items || data.teamMembers || [];
       return {
           teamMembers: members,
           data: {
               title: data.title || "Meet Our Team",
               description: data.description || "",
               members: members
           }
       };
    },
    AboutTeamSection: (data) => {
       const members = data.members || data.items || data.teamMembers || [];
       return {
           teamMembers: members,
           data: {
               title: data.title || "Meet Our Team",
               description: data.description || "",
               members: members
           }
       };
    },

    // Manufacturing Case Studies Section
    ManufacturingCaseStudiesSection: (data) => {
        const items = data.items || data.caseStudies || [];
        return {
            title: data.title || "Success Stories",
            description: data.description || "",
            items: items,
            caseStudies: items,
            data: {
                title: data.title || "Success Stories",
                description: data.description || "",
                items: items,
                caseStudies: items
            }
        };
    },
    // Alias for ManufacturingCaseStudies (without Section suffix) - matches componentMap.js
    ManufacturingCaseStudies: (data) => {
        const items = data.items || data.caseStudies || [];
        return {
            title: data.title || "Success Stories",
            description: data.description || "",
            items: items,
            caseStudies: items,
            data: {
                title: data.title || "Success Stories",
                description: data.description || "",
                items: items,
                caseStudies: items
            }
        };
    },
    CaseStudiesSection: (data) => {
        const items = data.items || data.caseStudies || [];
        return {
            title: data.title || "Success Stories",
            description: data.description || "",
            items: items,
            caseStudies: items,
            data: {
                title: data.title || "Success Stories",
                description: data.description || "",
                items: items,
                caseStudies: items
            }
        };
    },

    // Retail Challenges Section
    RetailChallengesSection: (data) => {
        const challenges = data.retailChallenges || data.challenges || data.items || [];
        return {
            title: data.title || "Retail Challenges",
            subtitle: data.subtitle || "",
            description: data.description || "",
            challenges: challenges,
            retailChallenges: challenges,
            image: data.image || "",
            data: {
                title: data.title || "Retail Challenges",
                subtitle: data.subtitle || "",
                description: data.description || "",
                challenges: challenges,
                image: data.image || ""
            }
        };
    },

    // Manufacturing Challenges Section
    ManufacturingChallengesSection: (data) => {
        const challenges = data.challenges || data.items || [];
        return {
            title: data.title || "Manufacturing Challenges",
            subtitle: data.subtitle || "",
            description: data.description || "",
            challenges: challenges,
            image: data.image || "",
            data: {
                title: data.title || "Manufacturing Challenges",
                subtitle: data.subtitle || "",
                description: data.description || "",
                challenges: challenges,
                image: data.image || ""
            }
        };
    },

    // Manufacturing Solutions Section
    ManufacturingSolutionsSection: (data) => {
        const solutions = data.solutions || data.items || [];
        // Normalize features in each solution
        const normalizedSolutions = solutions.map(sol => {
            let features = sol.features;
            if (typeof features === 'string') {
                features = features.split(',').map(f => f.trim()).filter(f => f);
            }
            return {
                ...sol,
                features: Array.isArray(features) ? features : []
            };
        });
        return {
            title: data.title || "NetSuite Solutions",
            subtitle: data.subtitle || "",
            description: data.description || "",
            solutions: normalizedSolutions,
            image: data.image || "",
            data: {
                title: data.title || "NetSuite Solutions",
                subtitle: data.subtitle || "",
                description: data.description || "",
                solutions: normalizedSolutions,
                image: data.image || ""
            }
        };
    },

    // Manufacturing Industry Stats
    ManufacturingIndustryStats: (data) => {
        const stats = data.stats || data.items || [];
        return {
            title: data.title || "Industry Stats",
            subtitle: data.subtitle || "",
            description: data.description || "",
            stats: stats,
            backgroundImage: data.backgroundImage || "",
            data: {
                title: data.title || "Industry Stats",
                subtitle: data.subtitle || "",
                description: data.description || "",
                stats: stats,
                backgroundImage: data.backgroundImage || ""
            }
        };
    },

    // Retail Case Studies Section
    RetailCaseStudiesSection: (data) => {
        const caseStudies = data.caseStudies || data.items || [];
        return {
            title: data.title || "Success Stories",
            subtitle: data.subtitle || "",
            description: data.description || "",
            caseStudies: caseStudies,
            items: caseStudies,
            data: {
                title: data.title || "Success Stories",
                subtitle: data.subtitle || "",
                description: data.description || "",
                caseStudies: caseStudies
            }
        };
    },

    // HR Use Cases Section
    HRUseCasesSection: (data) => {
        const useCases = data.useCases || data.items || [];
        return {
            title: data.title || "HR Use Cases",
            description: data.description || "",
            useCases: useCases,
            data: {
                title: data.title || "HR Use Cases",
                description: data.description || "",
                useCases: useCases
            }
        };
    },

    // About Milestones Section
    AboutMilestonesSection: (data) => {
        const milestones = data.milestones || [];
        const items = data.items || [];
        return {
            title: data.title || "Our Journey",
            subtitle: data.subtitle || "",
            description: data.description || "",
            milestones: milestones,
            items: items,
            data: {
                title: data.title || "Our Journey",
                subtitle: data.subtitle || "",
                description: data.description || "",
                milestones: milestones,
                items: items
            }
        };
    },

    // Service Grid Section
    ServiceGrid: (data) => {
        const services = data.services || data.items || [];
        // Normalize features in each service
        const normalizedServices = services.map(svc => {
            let features = svc.features;
            if (typeof features === 'string') {
                features = features.split(',').map(f => f.trim()).filter(f => f);
            }
            return {
                ...svc,
                features: Array.isArray(features) ? features : []
            };
        });
        return {
            title: data.title || "Our Services",
            subtitle: data.subtitle || "",
            services: normalizedServices,
            bottomCTA: data.bottomCTA || {},
            data: {
                title: data.title || "Our Services",
                subtitle: data.subtitle || "",
                services: normalizedServices,
                bottomCTA: data.bottomCTA || {}
            }
        };
    },

    // Programs Section (Training)
    ProgramsSection: (data) => {
        const programs = data.trainingPrograms || data.programs || data.items || [];
        const programsSection = data.programsSection || {};
        return {
            programsSection: {
                title: programsSection.title || data.title || "Training Programs",
                description: programsSection.description || data.description || "",
                image: programsSection.image || data.image || ""
            },
            trainingPrograms: programs,
            data: {
                programsSection: {
                    title: programsSection.title || data.title || "Training Programs",
                    description: programsSection.description || data.description || "",
                    image: programsSection.image || data.image || ""
                },
                trainingPrograms: programs
            }
        };
    },

    // Implementation Process Section
    ImplementationProcessSection: (data) => {
        const steps = data.steps || data.items || [];
        return {
            title: data.title || "Implementation Process",
            subtitle: data.subtitle || "",
            image: data.image || "",
            steps: steps,
            ctaButton: data.ctaButton || "",
            data: {
                title: data.title || "Implementation Process",
                subtitle: data.subtitle || "",
                image: data.image || "",
                steps: steps,
                ctaButton: data.ctaButton || ""
            }
        };
    },

    // Payroll How It Works Section
    PayrollHowItWorksSection: (data) => {
        const steps = data.steps || data.items || [];
        return {
            title: data.title || "How It Works",
            description: data.description || "",
            content: data.content || "",
            steps: steps,
            data: {
                title: data.title || "How It Works",
                description: data.description || "",
                content: data.content || "",
                steps: steps
            }
        };
    },

    // Manufacturing Implementation Process
    ManufacturingImplementationProcess: (data) => {
        const processSteps = data.processSteps || data.steps || data.items || [];
        return {
            title: data.title || "Manufacturing Implementation Process",
            description: data.description || "",
            processSteps: processSteps,
            steps: processSteps,
            data: {
                title: data.title || "Manufacturing Implementation Process",
                description: data.description || "",
                processSteps: processSteps
            }
        };
    },

    // Customization Process Section
    CustomizationProcessSection: (data) => {
        const steps = data.steps || data.items || [];
        return {
            title: data.title || "Customization Process",
            steps: steps,
            data: {
                title: data.title || "Customization Process",
                steps: steps
            }
        };
    },

    // Implementation Why Choose Section
    ImplementationWhyChooseSection: (data) => {
        const features = data.features || data.items || [];
        return {
            title: data.title || "Why Choose Us",
            subtitle: data.subtitle || "",
            image: data.image || "",
            features: features,
            data: {
                title: data.title || "Why Choose Us",
                subtitle: data.subtitle || "",
                image: data.image || "",
                features: features
            }
        };
    },

    // Why Choose Section (Generic)
    WhyChooseSection: (data) => {
        const features = data.features || data.trainingFeatures || data.items || [];
        const whyChooseSection = data.whyChooseSection || {};
        return {
            title: whyChooseSection.title || data.title || "Why Choose Us",
            subtitle: data.subtitle || "",
            description: whyChooseSection.description || data.description || "",
            features: features,
            trainingFeatures: features,
            whyChooseSection: {
                title: whyChooseSection.title || data.title || "Why Choose Us",
                description: whyChooseSection.description || data.description || ""
            },
            data: {
                title: whyChooseSection.title || data.title || "Why Choose Us",
                subtitle: data.subtitle || "",
                description: whyChooseSection.description || data.description || "",
                features: features
            }
        };
    },

    // HR Benefits Section
    HRBenefitsSection: (data) => {
        const benefits = data.benefits || data.items || [];
        const features = data.features || [];
        return {
            title: data.title || "Benefits",
            subtitle: data.subtitle || "",
            description: data.description || "",
            benefits: benefits,
            features: features,
            data: {
                title: data.title || "Benefits",
                subtitle: data.subtitle || "",
                description: data.description || "",
                benefits: benefits,
                features: features
            }
        };
    },

    // Implementation Pricing Section
    ImplementationPricingSection: (data) => {
        const plans = data.plans || data.pricing || data.items || [];
        // Normalize features in each plan
        const normalizedPlans = plans.map(plan => {
            let features = plan.features;
            if (typeof features === 'string') {
                features = features.split(',').map(f => f.trim()).filter(f => f);
            }
            return {
                ...plan,
                features: Array.isArray(features) ? features : []
            };
        });
        return {
            title: data.title || "Pricing",
            subtitle: data.subtitle || "",
            plans: normalizedPlans,
            data: {
                title: data.title || "Pricing",
                subtitle: data.subtitle || "",
                plans: normalizedPlans
            }
        };
    },

    // Retail Features Section
    RetailFeaturesSection: (data) => {
        const features = data.features || data.items || [];
        return {
            title: data.title || "Features",
            subtitle: data.subtitle || "",
            features: features,
            data: {
                title: data.title || "Features",
                subtitle: data.subtitle || "",
                features: features
            }
        };
    },
    
    // Retail CTA Section
    RetailCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your Retail Operations?"),
    
    // Other CTA Sections
    AboutCTASection: (data) => normalizeGenericCTA(data, "Ready to Build Something Great?"),
    HRCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your HR?"),
    ManufacturingCTASection: (data) => normalizeGenericCTA(data, "Ready to Transform Your Manufacturing Operations?"),
    CustomizationCTASection: (data) => normalizeGenericCTA(data, "Ready to Customize?"),

    // Retail Solutions Section
    RetailSolutionsSection: (data) => {
      console.log(" [RetailSolutionsSection] Raw form data:", data);
      
      const solutions = Array.isArray(data.solutions) ? data.solutions : (Array.isArray(data.items) ? data.items : []);
      
      // Normalize features in each solution
      const normalizedSolutions = solutions.map(sol => {
        let features = sol.features;
        if (typeof features === 'string') {
          features = features.split(',').map(f => f.trim()).filter(f => f);
        }
        return {
          ...sol,
          features: Array.isArray(features) ? features : []
        };
      });

      return {
        title: data.title || "NetSuite Solutions",
        subtitle: data.subtitle || "Comprehensive Retail Solutions",
        description: data.description || "",
        solutions: normalizedSolutions,
        image: data.image || "",
        data: {
          title: data.title || "NetSuite Solutions",
          subtitle: data.subtitle || "Comprehensive Retail Solutions",
          description: data.description || "",
          solutions: normalizedSolutions,
          image: data.image || "",
        }
      };
    },

    // Integration Components

    IntegrationTypesSection: (data) => {

      console.log(" [INTEGRATION TYPES DEBUG] Raw form data:", data);

      console.log(" [INTEGRATION TYPES DEBUG] Data structure analysis:", {

        hasIntegrationTypes: !!data.integrationTypes,

        hasItems: !!data.items,

        hasTypes: !!data.types,

        integrationTypesItems: data.integrationTypes?.items,

        directItems: data.items,

        directTypes: data.types,

        allDataKeys: Object.keys(data),

      });



      // PRIORITY: Direct form data OVERRIDES everything

      const itemsSource =

        data.items || // Direct items from form

        data.integrationTypes?.items || // Nested in integrationTypes

        data.types || // Alternative types array

        []; // Empty array fallback



      console.log(" [INTEGRATION TYPES DEBUG] Items source decision:", {

        source: data.items

          ? "directItems"

          : data.integrationTypes?.items

          ? "nestedItems"

          : data.types

          ? "types"

          : "empty",

        finalItems: itemsSource,

        itemsCount: itemsSource.length,

      });



      // FIX: Ensure proper property mapping for each item

      const normalizedItems = itemsSource.map((item, index) => {

        console.log(` [INTEGRATION TYPES DEBUG] Processing item ${index}:`, {

          originalItem: item,

          hasName: !!item.name,

          hasTitle: !!item.title,

          hasDescription: !!item.description,

          hasIcon: !!item.icon,

        });



        const normalizedItem = {

          title: item.title || item.name || `Integration ${index + 1}`, // Use title as primary (matches component)

          description:

            item.description || item.desc || "Integration description",

          icon: item.icon || "",

        };



        console.log(

          ` [INTEGRATION TYPES DEBUG] Normalized item ${index}:`,

          normalizedItem

        );

        return normalizedItem;

      });



      const normalized = {

        title:

          data.integrationTypes?.title || data.title || "Integration Solutions",

        items: normalizedItems,

      };



      console.log(

        " [INTEGRATION TYPES DEBUG] Final normalized data:",

        normalized

      );

      console.log(

        " [INTEGRATION TYPES DEBUG] Final items array with titles:",

        normalizedItems

      );

      return normalized;

    },



    IntegrationBenefitsSection: (data) => {

      console.log(" [INTEGRATION BENEFITS DEBUG] Raw form data:", data);

      console.log(" [INTEGRATION BENEFITS DEBUG] Data structure:", {

        hasBenefits: !!data.benefits,

        hasItems: !!data.items,

        benefitsType: Array.isArray(data.benefits)

          ? "array"

          : typeof data.benefits,

        itemsType: Array.isArray(data.items) ? "array" : typeof data.items,

        allKeys: Object.keys(data),

      });



      // Handle multiple possible data structures

      let benefitsArray = [];



      if (Array.isArray(data.benefits)) {

        // Direct benefits array from form

        benefitsArray = data.benefits;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using direct benefits array:",

          benefitsArray

        );

      } else if (Array.isArray(data.items)) {

        // Items array from form

        benefitsArray = data.items;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using items array:",

          benefitsArray

        );

      } else if (data.benefits && Array.isArray(data.benefits.items)) {

        // Nested benefits.items structure

        benefitsArray = data.benefits.items;

        console.log(

          " [INTEGRATION BENEFITS DEBUG] Using nested benefits.items:",

          benefitsArray

        );

      }



      console.log(

        " [INTEGRATION BENEFITS DEBUG] Benefits array:",

        benefitsArray

      );



      // Normalize each benefit item

      const normalizedBenefits = benefitsArray.map((item, index) => {

        console.log(

          ` [INTEGRATION BENEFITS DEBUG] Processing benefit ${index}:`,

          {

            originalItem: item,

            hasTitle: !!item.title,

            hasName: !!item.name,

            hasDescription: !!item.description,

            hasIcon: !!item.icon,

          }

        );



        const normalizedItem = {

          title: item.title || item.name || `Benefit ${index + 1}`,

          description: item.description || item.desc || "Benefit description",

          icon: item.icon || "",

        };



        console.log(

          ` [INTEGRATION BENEFITS DEBUG] Normalized benefit ${index}:`,

          normalizedItem

        );

        return normalizedItem;

      });



      const normalized = {

        title: data.benefits?.title || data.title || "Integration Benefits",

        items: normalizedBenefits,

        benefits: normalizedBenefits, // Support both prop names

      };



      console.log(

        " [INTEGRATION BENEFITS DEBUG] Final normalized data:",

        normalized

      );

      return normalized;

    },



    // Customization Components

    CustomizationServicesSection: (data) => {

      console.log(" [CUSTOMIZATION SERVICES DEBUG] Raw form data:", data);

      console.log(" [CUSTOMIZATION SERVICES DEBUG] Data structure:", {

        hasServices: !!data.services,

        hasItems: !!data.items,

        hasCustomizationServices: !!data.customizationServices,

        servicesType: Array.isArray(data.services)

          ? "array"

          : typeof data.services,

        itemsType: Array.isArray(data.items) ? "array" : typeof data.items,

        allKeys: Object.keys(data),

      });



      // Handle multiple data structures

      const servicesSource =

        data.services ||

        data.items ||

        data.customizationServices?.services ||

        [];



      console.log(

        " [CUSTOMIZATION SERVICES DEBUG] Services source:",

        servicesSource

      );



      // Normalize each service item

      const normalizedServices = servicesSource.map((service, index) => {

        console.log(

          ` [CUSTOMIZATION SERVICES DEBUG] Processing service ${index}:`,

          {

            originalService: service,

            hasName: !!service.name,

            hasTitle: !!service.title,

            hasDescription: !!service.description,

            hasIcon: !!service.icon,

          }

        );



        const normalizedService = {

          name: service.name || service.title || `Service ${index + 1}`,

          description:

            service.description || service.desc || "Service description",

          icon: service.icon || "",

        };



        console.log(

          ` [CUSTOMIZATION SERVICES DEBUG] Normalized service ${index}:`,

          normalizedService

        );

        return normalizedService;

      });



      const normalized = {

        title:

          data.title ||

          data.customizationServices?.title ||

          "What We Customize",

        subtitle:

          data.subtitle ||

          data.customizationServices?.subtitle ||

          "Comprehensive customization services",

        description:

          data.description ||

          data.customizationServices?.description ||

          "Tailor NetSuite to match your unique business processes",

        services: normalizedServices,

        items: normalizedServices, // Support both prop names

      };



      console.log(

        " [CUSTOMIZATION SERVICES DEBUG] Final normalized data:",

        normalized

      );

      return normalized;

    },



    PopularIntegrationsSection: (data) => ({

      title:

        data.popularIntegrations?.title || data.title || "Popular Integrations",

      platforms: data.popularIntegrations?.platforms || data.platforms || [],

    }),



    // Payroll Components

    PayrollHeroSection: (data) => ({

      title: data.title || "Automated Payroll Solutions",

      subtitle:

        data.subtitle || "Simplify payroll processing with our advanced system",

      description:

        data.description ||

        "Reduce errors and save time with automated payroll management",

      ctaButton: data.ctaButton || {

        text: "Get Started",

        link: "/payroll",

        variant: validateVariant("primary"),

      },

      backgroundImage: data.backgroundImage,

      bgVideo: data.bgVideo,

      bgColor: data.bgColor,

    }),



    PayrollPainPointsSection: (data) => {
      console.log(" [PayrollPainPointsSection] Raw form data:", data);
      
      // Extract painPoints array from various possible locations
      const painPointsArray = 
        data.painPoints?.painPoints ||
        data.painPoints?.items ||
        (Array.isArray(data.painPoints) ? data.painPoints : null) ||
        data.items ||
        [];
      
      // Build the painPoints object that the component expects
      const painPointsData = {
        title: data.title || data.painPoints?.title || "Common Payroll Pain Points",
        description: data.description || data.painPoints?.description || "Problems we solve",
        painPoints: painPointsArray,
        image: data.image || data.painPoints?.image || "",
      };
      
      return {
        // Component expects a `painPoints` prop
        painPoints: painPointsData,
        // Also spread at top level for compatibility
        title: painPointsData.title,
        description: painPointsData.description,
        image: painPointsData.image,
      };
    },



    PayrollBenefitsSection: (data) => ({

      title: data.benefits?.title || data.title || "Payroll Benefits",

      items: data.benefits?.items || data.items || [],

      benefits: data.benefits?.items || data.benefits || data.items || [],

    }),



    PayrollWorkflowSection: (data) => {
      console.log(" [PayrollWorkflowSection] Raw form data:", data);
      
      // Extract steps from various possible locations
      const stepsArray = 
        data.workflowSteps ||
        data.steps ||
        data.workflow?.steps ||
        [];
      
      // Process steps to ensure proper structure
      const processedSteps = stepsArray.map((step, index) => ({
        title: step.title || step.stepTitle || `Step ${index + 1}`,
        stepTitle: step.stepTitle || step.title || `Step ${index + 1}`,
        description: step.description || step.stepDescription || "",
        stepDescription: step.stepDescription || step.description || "",
        features: Array.isArray(step.features) 
          ? step.features 
          : (typeof step.features === 'string' ? step.features.split(',').map(f => f.trim()) : []),
        automated: step.automated || "",
        compliant: step.compliant || "",
        automatedLabel: step.automatedLabel || "Automated",
        compliantLabel: step.compliantLabel || "Compliant",
      }));
      
      // Build workflowData object that component expects
      const workflowData = {
        title: data.title || data.workflow?.title || "Payroll System Built for All Industries",
        description: data.description || data.workflow?.description || "Streamline your entire payroll lifecycle",
        steps: processedSteps,
      };
      
      return {
        // Component expects a `workflowData` prop
        workflowData: workflowData,
        // Also spread at top level for compatibility
        title: workflowData.title,
        description: workflowData.description,
        steps: workflowData.steps,
      };
    },



    PayrollStepperSection: (data) => ({

      title:

        data.coreWorkflow?.title ||

        data.stepper?.title ||

        data.title ||

        "Payroll Process Steps",

      steps:

        data.coreWorkflow?.steps ||

        data.stepper?.steps ||

        data.steps ||

        data.stepper ||

        [],

    }),



    PayrollFAQSection: (data) => {
      console.log(" [PayrollFAQSection] Raw form data:", data);
      
      const items = data.faqItems || data.faq?.items || data.faq?.faqs || data.faqs || data.items || [];
      
      return {
        faqData: {
          title: data.faq?.title || data.title || "Payroll FAQ",
          subtitle: data.faq?.subtitle || data.subtitle || "Frequently asked questions",
          items: items
        }
      };
    },



    PayrollCTASection: (data) => {

      console.log(" [PayrollCTASection] Raw form data:", data);



      // SIMPLIFIED APPROACH: Use form data directly, minimal defaults

      const normalized = {

        // DIRECT FORM DATA MAPPING - no complex fallbacks

        title: data.title || "Ready to Simplify Your Payroll?",

        subtitle: data.subtitle || "",

        description: data.description || "",



        // CTA Button - simple structure

        ctaButton: {

          text: data.ctaButton?.text || data.buttonText || "Start Free Trial",

          link: data.ctaButton?.link || data.link || "/payroll/trial",

          variant: data.ctaButton?.variant || "primary",

        },



        // Features - only include if provided

        ...(data.features && { features: data.features }),

        ...(data.trustedBy && { trustedBy: data.trustedBy }),

      };



      console.log(" [PayrollCTASection] Normalized data:", normalized);

      return normalized;

    },



    PayrollFeaturesSection: (data) => ({

      title: data.features?.title || data.title || "Key Features",

      description:

        data.features?.description || data.subtitle || data.description,

      items: data.features?.items || data.features || data.items || [],

    }),



    PayrollWhyPerfectSection: (data) => ({

      title: data.whyPerfect?.title || data.title || "Why It's Perfect",

      items: data.whyPerfect?.items || data.whyPerfect || data.items || [],

    }),



    // About Components
    
    AboutMissionSection: (data) => {
      console.log(" [AboutMissionSection] Raw form data:", data);
      
      return {
        data: {
          title: data.title || "Our Mission",
          subtitle: data.subtitle || "",
          description: data.description || "To empower businesses with innovative technology solutions.",
          vision: data.vision || "",
          additionalContent: data.additionalContent || "",
          image: data.image || "/images/ourProServices.png",
          imageAlt: data.imageAlt || "About Bellatrix - Professional Services",
          stats: Array.isArray(data.stats) ? data.stats : [],
          missionPoints: Array.isArray(data.missionPoints) ? data.missionPoints : [],
        },
      };
    },

    AboutJourneySection: (data) => {
      console.log(" [AboutJourneySection] Raw form data:", data);
      
      return {
        data: {
          title: data.title || "Our Journey",
          description: data.description || "From humble beginnings to becoming a trusted Oracle NetSuite partner.",
          beginningTitle: data.beginningTitle || "The Beginning",
          beginningText: data.beginningText || "",
          growthTitle: data.growthTitle || "Growth & Evolution",
          growthText: data.growthText || "",
          todayTitle: data.todayTitle || "Today",
          todayText: data.todayText || "",
          imageUrl: data.imageUrl || data.image || "/images/solution.jpg",
          milestones: Array.isArray(data.milestones) ? data.milestones : [],
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
        },
      };
    },

    AboutValuesSection: (data) => {
      console.log(" [AboutValuesSection] Raw form data:", data);
      
      return {
        data: {
          title: data.title || "Our Values",
          description: data.description || "",
          items: Array.isArray(data.items) ? data.items : (Array.isArray(data.values) ? data.values : []),
        },
        values: Array.isArray(data.items) ? data.items : (Array.isArray(data.values) ? data.values : []),
      };
    },

    AboutDifferentiatorsSection: (data) => {
      console.log(" [AboutDifferentiatorsSection] Raw form data:", data);
      
      return {
        data: {
          title: data.title || "What Makes Us Different",
          description: data.description || "",
          items: Array.isArray(data.items) ? data.items : [],
        },
        items: Array.isArray(data.items) ? data.items : [],
      };
    },



    // HR Components





    HRModulesSection: (data) => ({

      data: {

        title: data.title || "HR Modules",

        subtitle: data.subtitle || "Comprehensive HR solutions",

        description: data.description || "",

        modules: (data.features || data.modules || data.items || []).map(

          (item) => ({

            ...item,

            desc: item.description || item.desc || "Module description",

          })

        ),

      },

    }),



    HRBenefitsSection: (data) => {
      console.log(" [HRBenefitsSection] Raw form data:", data);
      
      const items = Array.isArray(data.features) ? data.features : (Array.isArray(data.benefits) ? data.benefits : (Array.isArray(data.items) ? data.items : []));
      
      return {
        data: {
          features: {
            title: data.title || "Why Choose Our HR Solution?",
            description: data.description || "Discover the key advantages that make our HR platform the smart choice for modern businesses of all sizes and industries.",
            items: items
          }
        }
      };
    },

    HRPricingSection: (data) => {
      console.log(" [HRPricingSection] Raw form data:", data);
      
      return {
        data: {
          title: data.title || "Implementation Pricing",
          description: data.description || "Choose the perfect implementation plan that fits your business needs and budget",
          pricing: Array.isArray(data.pricing) ? data.pricing : (Array.isArray(data.items) ? data.items : []),
        }
      };
    },

    HRFAQSection: (data) => {
      console.log(" [HRFAQSection] Raw form data:", data);
      
      const items = data.faq?.items || data.faq?.faqs || data.faqs || data.items || [];
      
      return {
        data: {
          faq: {
            title: data.faq?.title || data.title || "Frequently Asked Questions",
            items: items.map(item => ({
              q: item.question || item.q,
              a: item.answer || item.a
            }))
          }
        }
      };
    },

    // Training Components

    TrainingHeroSection: (data) => {

      console.log(" [TrainingHeroSection] Raw form data:", data);

      console.log(" [TRAINING HERO DEBUG] CTA Button data:", {

        hasCtaButton: !!data.ctaButton,

        ctaButtonData: data.ctaButton,

        hasButtonText: !!data.buttonText,

        hasLink: !!data.link,

        hasVariant: !!data.variant,

      });



      const buttonVariant = validateVariant(

        data.ctaButton?.variant || data.variant || "primary"

      );



      console.log(" [TrainingHeroSection] Variant Processing:", {

        originalVariant: data.ctaButton?.variant || data.variant,

        processedVariant: buttonVariant,

        variantType: typeof buttonVariant,

      });



      const normalized = {

        heroContent: {

          title:

            data.heroContent?.title ||

            data.hero?.title ||

            data.title ||

            "Professional Training Programs",

          subtitle:

            data.heroContent?.subtitle ||

            data.hero?.subtitle ||

            data.subtitle ||

            "Professional ERP Education & Skills Development",

          description:

            data.heroContent?.description ||

            data.hero?.description ||

            data.description ||

            "Empower your team with comprehensive training solutions designed to enhance skills and drive success",

        },

        backgroundVideo:

          data.backgroundVideo ||

          data.bgVideo ||

          data.heroContent?.backgroundVideo ||

          "/trainingHeroSectionTwo.mp4",

        // Proper CTA button handling with form data

        ctaButton: data.ctaButton

          ? {

              text: data.ctaButton.text || "Start Learning Today",

              link: data.ctaButton.link || "/training",

              variant: buttonVariant,

              icon: data.ctaButton.icon,

            }

          : {

              text: data.buttonText || "Start Learning Today",

              link: data.link || "/training",

              variant: buttonVariant,

            },

      };



      console.log(

        " [TrainingHeroSection] Normalized data with CTA:",

        normalized

      );

      return normalized;

    },



    TrainingProgramsSection: (data) => {

      console.log(" [NORMALIZE DEBUG] TrainingProgramsSection RAW DATA:", {

        directImage: data.image,

        programsSectionImage: data.programsSection?.image,

        allDataKeys: Object.keys(data),

        fullData: data,

      });



      // PRIORITY: Direct form data OVERRIDES everything

      const imageSource =

        data.image || // Direct image from form

        data.programsSection?.image || // Nested in programsSection

        data.programsSection?.image || // From existing programsSection

        "/images/traning.jpg"; // Final fallback



      console.log(" [NORMALIZE DEBUG] Final image decision:", {

        source: data.image

          ? "direct"

          : data.programsSection?.image

          ? "nested"

          : "fallback",

        finalImage: imageSource,

        imageSources: {

          directImage: data.image,

          programsSectionImage: data.programsSection?.image,

          fallbackImage: "/images/traning.jpg",

        },

      });



      const normalized = {

        programsSection: {

          title:

            data.title ||

            data.programsSection?.title ||

            "Our Training Programs",

          description:

            data.description ||

            data.programsSection?.description ||

            "Comprehensive training solutions designed to empower your team with the skills they need to excel",

          image: imageSource, // USE THE RESOLVED IMAGE

          Professional_Badge:

            data.badge ||

            data.programsSection?.Professional_Badge ||

            "Certified Training",

        },

        trainingPrograms: {

          programs:

            data.trainingPrograms?.programs ||

            data.programs ||

            data.trainingPrograms ||

            [],

        },

      };



      console.log(" [NORMALIZE DEBUG] Final normalized data:", normalized);

      console.log(

        " [NORMALIZE DEBUG] Final image URL:",

        normalized.programsSection.image

      );

      return normalized;

    },



    TrainingWhyChooseSection: (data) => ({

      whyChooseSection: data.whyChooseSection || {

        title: data.title || "Why Choose Our Training?",

        subtitle: data.subtitle || "We provide world-class training solutions",

        image: data.image || "/images/choose.png",

        Professional_Badge: data.badge || "Excellence Training",

      },

      trainingFeatures: data.trainingFeatures || data.features || [],

    }),



    // Implementation Components

    ImplementationHeroSection: (data) => {

      console.log(" [ImplementationHeroSection] Raw form data:", data);



      // FIX: Use validateVariant to convert string to proper variant

      const ctaVariant = validateVariant(

        data.ctaButton?.variant || data.variant || "primary"

      );



      const normalized = {

        data: {

          backgroundVideo:

            data.backgroundVideo ||

            data.backgroundImage ||

            "/Videos/HomeHeroSectionV.mp4",

          backgroundImage:

            data.backgroundImage ||

            data.backgroundVideo ||

            "/Videos/HomeHeroSectionV.mp4",

          title: data.title || "Implementation Services",

          subtitle: data.subtitle || "Seamless deployments by experts",

          titleParts:

            data.titleParts ||

            (data.title && data.subtitle

              ? [data.title, data.subtitle]

              : ["Implementation", "Services", "Made", "Simple"]),

          description:

            data.description ||

            "We plan, configure, and launch with zero downtime",

          ctaButton: {

            text:

              data.ctaButton?.text || data.buttonText || "Talk to an expert",

            link: data.ctaButton?.link || data.link || null,

            variant: ctaVariant, // Now this is a validated variant string

            icon:

              data.ctaButton?.icon || data.icon || "M13 7l5 5m0 0l-5 5m5-5H6",

          },

        },

      };



      console.log(

        " [ImplementationHeroSection] Normalized data:",

        normalized

      );

      console.log(" [ImplementationHeroSection] CTA Variant:", ctaVariant);

      return normalized;

    },

    ImplementationPricingSection: (data) => {
      console.log(" [ImplementationPricingSection] Raw form data:", data);
      
      const plans = Array.isArray(data.plans) ? data.plans : (Array.isArray(data.pricing) ? data.pricing : (Array.isArray(data.items) ? data.items : []));
      
      return {
        data: {
          title: data.title || "Implementation Pricing",
          subtitle: data.subtitle || "Choose the perfect implementation plan that fits your business needs and budget",
          plans: plans,
          additionalInfo: data.additionalInfo || {
             note: "All plans include free consultation and project scoping",
             contactText: "Need a custom solution? Contact our team for personalized pricing"
          }
        }
      };
    },

    ImplementationProcessSection: (data) => ({

      title: data.process?.title || data.title || "Implementation Process",

      subtitle:

        data.process?.subtitle || data.subtitle || "Our proven methodology",

      description:

        data.process?.description ||

        data.description ||

        "A structured approach to successful implementation",

      image: data.image || "",

      phases: data.process?.phases || data.phases || data.steps || [],

    }),



    // Manufacturing-specific implementation process: Some builders save the

    // steps under different keys (processSteps, steps, items). The

    // manufacturing component expects a `data` prop with a `steps` array

    // (see `ImplementationProcess.jsx` -> useComponentData('implementationProcess', data, ...)).





    ImplementationBenefitsSection: (data) => ({

      title: data.benefits?.title || data.title || "Implementation Benefits",

      items: data.benefits?.items || data.items || [],

      benefits: data.benefits?.items || data.benefits || data.items || [],

    }),



    // About Components
    AboutHeroSection: (data) => {

      console.log(" [AboutHeroSection] Raw form data:", data);



      return {
        title: data.title || "About Us",
        subtitle: data.subtitle || "Your trusted partner",
        description: data.description || "We help businesses transform",
        backgroundVideo: data.backgroundVideo || "",
        backgroundImage: data.backgroundImage || "",
        image: data.image || "",
        stats: data.stats || [],

        data: {

          title: data.title || "About Us",

          subtitle: data.subtitle || "Your trusted partner",

          description: data.description || "We help businesses transform",

          backgroundVideo: data.backgroundVideo || "",

          stats: data.stats || [],

        },

      };

    },


    // NOTE: AboutMissionSection, AboutJourneySection, AboutValuesSection, 
    // AboutDifferentiatorsSection, and AboutMilestonesSection are defined earlier in the file
    // Do not add duplicate definitions here.







    // Generic fallback for unknown components

    default: (data) => {

      // Try to extract common patterns

      const normalized = {};



      // Common title patterns

      if (data.title) normalized.title = data.title;

      if (data.subtitle) normalized.subtitle = data.subtitle;

      if (data.description) normalized.description = data.description;
      
      // Hero component specific patterns
      if (data.slides) normalized.slides = data.slides;
      if (data.stats) normalized.stats = data.stats;
      if (data.video) normalized.video = data.video;
      if (data.backgroundVideo) normalized.backgroundVideo = data.backgroundVideo;
      if (data.backgroundImage) normalized.backgroundImage = data.backgroundImage;
      if (data.image) normalized.image = data.image;
      if (data.imageUrl) normalized.imageUrl = data.imageUrl;
      // Also try to extract image from nested section objects
      if (!normalized.image && data.programsSection?.image) normalized.image = data.programsSection.image;
      if (!normalized.image && data.heroSection?.image) normalized.image = data.heroSection.image;
      
      // Common object patterns - pass through nested sections
      if (data.ctaButton) normalized.ctaButton = data.ctaButton;
      if (data.sectionHeader) normalized.sectionHeader = data.sectionHeader;
      if (data.programsSection) normalized.programsSection = data.programsSection;
      if (data.trainingPrograms) normalized.trainingPrograms = data.trainingPrograms;
      if (data.features) normalized.features = data.features;
      if (data.data) normalized.data = data.data;



      // Common array patterns - try to find the most relevant array

      const arrayKeys = [

        "items",

        "list",

        "steps",

        "benefits",

        "features",

        "modules",

        "programs",

        "faqs",

        "painPoints",
        
        "slides",
        
        "stats",
        
        "testimonials",
        
        "industries",
        
        "services",
        
        "values",
        
        "members",
        
        "milestones",
        
        "useCases",

      ];

      for (const key of arrayKeys) {

        if (data[key] && Array.isArray(data[key])) {

          normalized[key] = data[key];

          // Also set as 'items' for components that expect it

          if (!normalized.items) normalized.items = data[key];

        }

      }



      return normalized;

    },

  };



  // Get the specific mapping function or use default

  const mappingFunction =

    componentMappings[componentType] || componentMappings["default"];



  if (!mappingFunction) {

    console.warn(

      `normalizeProps: No mapping function found for ${componentType}`

    );

    return {};

  }



  try {

    const normalizedProps = mappingFunction(cleanedData);



    // Enhanced logging to verify form data is being used

    console.log(` [normalizeProps] Successfully normalized ${componentType}`);

    console.log(

      ` [normalizeProps] Input data keys:`,

      Object.keys(cleanedData)

    );

    console.log(

      ` [normalizeProps] Output props keys:`,

      Object.keys(normalizedProps)

    );



    // Check if form data was actually used (not just defaults)

    const hasFormData = Object.keys(cleanedData).length > 0;

    if (hasFormData) {

      console.log(

        ` [normalizeProps] Form data detected and processed for ${componentType}`

      );

    } else {

      console.log(

        ` [normalizeProps] No form data found for ${componentType}, using defaults`

      );

    }



    return normalizedProps;

  } catch (error) {

    console.error(

      ` [normalizeProps] Error normalizing props for ${componentType}:`,

      error

    );

    return {};

  }

};



/**

 * Helper function to safely extract data from nested JSON structures

 * @param {Object} data - The data object

 * @param {string} path - Dot notation path (e.g., 'integrationTypes.items')

 * @param {*} defaultValue - Default value if path not found

 * @returns {*} - The value at the path or default value

 */

export const safeGet = (data, path, defaultValue = null) => {

  if (!data || typeof data !== "object") return defaultValue;



  const keys = path.split(".");

  let current = data;



  for (const key of keys) {

    if (current && typeof current === "object" && key in current) {

      current = current[key];

    } else {

      return defaultValue;

    }

  }



  return current !== undefined ? current : defaultValue;

};



/**

 * Validates that required props are present for a component

 * @param {string} componentType - The component type

 * @param {Object} props - The props to validate

 * @returns {Object} - Validation result with isValid and missingProps

 */

export const validateProps = (componentType, props) => {

  const requiredProps = {

    IntegrationTypesSection: ["title", "items"],

    IntegrationBenefitsSection: ["title", "items"],

    CustomizationServicesSection: ["title", "items"],

    PopularIntegrationsSection: ["title", "platforms"],

    PayrollHeroSection: ["title", "subtitle"],

    PayrollPainPointsSection: ["title", "painPoints"],

    PayrollBenefitsSection: ["title", "items"],

    PayrollWorkflowSection: ["title", "steps"],

    PayrollStepperSection: ["steps"],

    PayrollFAQSection: ["title", "faqs"],

    PayrollCTASection: ["title", "cta"],

    HRHeroSection: ["data"],

    HRModulesSection: ["data"],

    HRBenefitsSection: ["title", "items"],

    ImplementationHeroSection: ["data"],

    ImplementationCTASection: ["title", "ctaButton"],

    TrainingHeroSection: ["heroContent"],

    TrainingProgramsSection: ["programsSection", "trainingPrograms"],

    TrainingWhyChooseSection: ["whyChooseSection", "trainingFeatures"],

  };



  const required = requiredProps[componentType] || [];

  const missingProps = required.filter((prop) => {

    if (prop.includes(".")) {

      // Handle nested props like 'data.hero'

      return !safeGet(props, prop);

    }

    return (

      !props[prop] || (Array.isArray(props[prop]) && props[prop].length === 0)

    );

  });



  return {

    isValid: missingProps.length === 0,

    missingProps,

  };

};



export default normalizeProps;

