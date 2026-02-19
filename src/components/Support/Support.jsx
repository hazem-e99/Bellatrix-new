import React, { useMemo } from "react";
import SEO from "../SEO";
import SupportSecondSec from "./SupportSecondSec";
import SherpaCareServices from "./SherpaCareServices";
import WhatWeOfferSection from "./WhatWeOfferSection";
import DedicatedTeamSection from "./DedicatedTeamSection";
import PrePackagedSection from "./PrePackagedSection";
import BellatrixSupportSection from "./BellatrixSupportSection";
import PayPerUseSection from "./PayPerUseSection";
import CustomerSupport from "./CustomerSupport";
import WhyChoeseBellatrix from "./WhyChoeseBellatrix";
import BellatrixSupportHero from "./BellatrixSupportHero";
import { usePageData } from "../../hooks/usePageData";

/**
 * Build a lookup map: componentType → { parsedJson, updatedAt }
 * from the API page components array.
 */
const useComponentDataMap = (pageData) =>
  useMemo(() => {
    const components =
      pageData?.components || pageData?.sections || [];
    const map = {};
    components.forEach((comp) => {
      if (!comp.componentType) return;
      try {
        const json =
          typeof comp.contentJson === "string"
            ? JSON.parse(comp.contentJson)
            : comp.contentJson || {};
        map[comp.componentType] = {
          data: json,
          _updatedAt: comp.updatedAt || comp.updated_at,
        };
      } catch {
        map[comp.componentType] = { data: {}, _updatedAt: null };
      }
    });
    return map;
  }, [pageData]);

const Support = () => {
  const { pageData } = usePageData("Support");
  const dataMap = useComponentDataMap(pageData);

  const props = (type) => dataMap[type] || {};

  return (
    <>
      <SEO
        title="Bellatrix Support Services | ERP Support & Consulting"
        description="Comprehensive Bellatrix support services with 85+ certified professionals. Get expert ERP support, 24/7 assistance, and flexible pricing solutions."
        keywords="Bellatrix support, ERP support, ERP consulting, certified professionals, 24/7 support, flexible pricing, implementation support, customization"
        ogTitle="Bellatrix Support Services | ERP Support & Consulting"
        ogDescription="Professional Bellatrix support with certified experts, flexible pricing, and comprehensive ERP solutions for your business success."
        ogImage="/images/Support/bellatrix-support-main.jpg"
      />
      <main>
        <BellatrixSupportHero    {...props("SupportHeroSection")}              />
        <SupportSecondSec        {...props("SupportSecondSection")}             />
        <SherpaCareServices      {...props("SupportSherpaCareSection")}         />
        <WhatWeOfferSection      {...props("SupportWhatWeOfferSection")}        />
        <DedicatedTeamSection    {...props("SupportDedicatedTeamSection")}      />
        <PrePackagedSection      {...props("SupportPrePackagedSection")}        />
        <BellatrixSupportSection {...props("SupportBellatrixSection")}          />
        <PayPerUseSection        {...props("SupportPayPerUseSection")}          />
        <CustomerSupport         {...props("SupportCustomerSection")}           />
        <WhyChoeseBellatrix      {...props("SupportWhyChooseSection")}          />
      </main>
    </>
  );
};

export default Support;
