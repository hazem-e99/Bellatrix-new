import React from "react";
import SEO from "../SEO";

const PrePackagedSection = ({
  data,
  // Direct props for Page Builder / normalizeProps
  title: propTitle,
  description: propDescription,
  subtitle: propSubtitle,
  items: propItems,
  packages: propPackages,
}) => {
  // Default data
  const defaultData = {
    title: "Pre-Packaged, Yet Flexible",
    description:
      "By leveraging our 18 years of experience, we've come up with the perfect package that allows you to rely on our expertise to schedule the required resources while keeping you in control over how the resources are spent, and for what.",
    packages: [],
  };

  // PRIORITIZE direct props > data prop > default data
  const sectionData = {
    title: propTitle || data?.title || defaultData.title,
    subtitle: propSubtitle || data?.subtitle || "",
    description: propDescription || data?.description || defaultData.description,
    packages:
      propItems ||
      propPackages ||
      data?.items ||
      data?.packages ||
      defaultData.packages,
  };

  return (
    <>
      <SEO
        title="Pre-Packaged Flexible Support | Bellatrix ERP Support Solutions"
        description="Get pre-packaged yet flexible Bellatrix support solutions backed by 18 years of ERP experience. Perfect balance of expertise and control over resources."
        keywords="pre-packaged support, flexible ERP solutions, Bellatrix expertise, 18 years experience, resource management, ERP consulting packages"
        ogTitle="Pre-Packaged Flexible Support | Bellatrix ERP Support Solutions"
        ogDescription="Leverage 18 years of ERP expertise with our pre-packaged yet flexible support solutions that keep you in control of resource allocation."
        ogImage="/images/Support/prepackaged-support.jpg"
      />
      <section
        className="light-section"
        style={{
          backgroundColor: "#f7f7f7",
          padding: "60px 25px 50px 25px",
          margin: "100px auto",
          borderRadius: "15px",
          boxShadow:
            "0px 4px 16px rgba(0, 0, 0, 0.1), 0px 8px 32px rgba(0, 0, 0, 0.05)",
          opacity: 0.9,
          color: "#000",
          textAlign: "center",
          fontFamily: '"Gotham A", "Gotham B"',
          width: "80%",
        }}
      >
        <div
          style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 15px" }}
        >
          <header>
            <h2
              style={{
                fontSize: "30px",
                marginBottom: "16px",
                letterSpacing: "-1px",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontFamily: "Gotham A , san-saif",
              }}
            >
              {sectionData.title}
            </h2>
            {sectionData.subtitle && (
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#333",
                }}
              >
                {sectionData.subtitle}
              </p>
            )}
          </header>
          <p style={{ fontSize: "19px", lineHeight: "1.6", marginBottom: "48px" }}>
            {sectionData.description}
          </p>

          {/* Packages / Items */}
          {sectionData.packages && sectionData.packages.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
                gap: "24px",
                textAlign: "left",
                marginTop: "16px",
              }}
            >
              {sectionData.packages.map((pkg, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "32px 24px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {/* Package Name */}
                  {pkg.name && (
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1a1a1a",
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {pkg.name}
                    </h3>
                  )}

                  {/* Price */}
                  {pkg.price && (
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#C41E3A",
                        margin: "0",
                      }}
                    >
                      {pkg.price}
                    </p>
                  )}

                  {/* Package Description */}
                  {pkg.description && (
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#555",
                        lineHeight: "1.6",
                        margin: "0",
                      }}
                    >
                      {pkg.description}
                    </p>
                  )}

                  {/* Features List */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "8px 0 0 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {pkg.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            fontSize: "14px",
                            color: "#444",
                          }}
                        >
                          <span style={{ color: "#C41E3A", fontWeight: "700", flexShrink: 0 }}>
                            ✓
                          </span>
                          {typeof feature === "string" ? feature : feature.text || feature.label || ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PrePackagedSection;
