import React, { useState } from "react";
import SEO from "./SEO";
import { postJson } from "../lib/api";

const ContactForm = ({
  onSubmit,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    country: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.industry &&
      formData.country &&
      formData.message.trim() && formData.message.trim().length >= 10
    );
  };

  const industryToEnum = (label) => {
    const map = { "Manufacturing": 1, "Retail & E-commerce": 2, "Healthcare": 3, "Finance & Banking": 4, "Technology": 5, "Professional Services": 6, "Non-Profit": 7, "Other": 8 };
    return map[label] ?? 0;
  };

  const countryToEnum = (label) => {
    const map = { "United States": 3898, "Canada": 3386, "United Kingdom": 3895, "Australia": 3194, "Germany": 3413, "France": 3406, "UAE": 3890, "Saudi Arabia": 3760, "Egypt": 3358, "Other": 999 };
    return map[label] ?? 999;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (onSubmit) return onSubmit(e);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phone.trim() || null,
      companyName: formData.companyName.trim() || null,
      industry: industryToEnum(formData.industry),
      country: countryToEnum(formData.country),
      message: formData.message.trim(),
    };

    if (!payload.fullName || !payload.email || !payload.message || payload.message.length < 10 || payload.industry === 0) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await postJson("/ContactMessages/submit", payload);
      setSuccess(true);
      if (typeof onSuccess === "function") onSuccess();
      setFormData({ fullName: "", email: "", phone: "", companyName: "", industry: "", country: "", message: "" });
    } catch (err) {
      setError(err?.message || "Failed to submit. Please try again.");
      if (typeof onError === "function") onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm placeholder-white/40 focus:bg-white/10 focus:border-cyan-400/50 focus:outline-none transition-all";
  const selectClasses = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm focus:bg-white/10 focus:border-cyan-400/50 focus:outline-none transition-all cursor-pointer";
  const labelClasses = "text-white/70 text-xs font-medium mb-1 block";

  return (
    <>
      <SEO
        title="Contact Bellatrix | Oracle NetSuite Consultation"
        description="Contact Bellatrix for Oracle NetSuite consulting services."
      />

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-green-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Message sent successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-2 text-red-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {error}
          </div>
        )}

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Full Name <span className="text-cyan-400">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClasses} placeholder="John Doe" required />
          </div>
          <div>
            <label className={labelClasses}>Email <span className="text-cyan-400">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} placeholder="john@company.com" required />
          </div>
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClasses} placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <label className={labelClasses}>Company</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={inputClasses} placeholder="Your Company" />
          </div>
        </div>

        {/* Row 3: Industry & Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClasses}>Industry <span className="text-cyan-400">*</span></label>
            <select name="industry" value={formData.industry} onChange={handleInputChange} className={selectClasses} required
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="bg-[#001248]">Select...</option>
              <option value="Manufacturing" className="bg-[#001248]">Manufacturing</option>
              <option value="Retail & E-commerce" className="bg-[#001248]">Retail & E-commerce</option>
              <option value="Healthcare" className="bg-[#001248]">Healthcare</option>
              <option value="Finance & Banking" className="bg-[#001248]">Finance & Banking</option>
              <option value="Technology" className="bg-[#001248]">Technology</option>
              <option value="Professional Services" className="bg-[#001248]">Professional Services</option>
              <option value="Other" className="bg-[#001248]">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Country <span className="text-cyan-400">*</span></label>
            <select name="country" value={formData.country} onChange={handleInputChange} className={selectClasses} required
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px', appearance: 'none', paddingRight: '28px' }}>
              <option value="" className="bg-[#001248]">Select...</option>
              <option value="United States" className="bg-[#001248]">United States</option>
              <option value="United Kingdom" className="bg-[#001248]">United Kingdom</option>
              <option value="Canada" className="bg-[#001248]">Canada</option>
              <option value="UAE" className="bg-[#001248]">UAE</option>
              <option value="Saudi Arabia" className="bg-[#001248]">Saudi Arabia</option>
              <option value="Egypt" className="bg-[#001248]">Egypt</option>
              <option value="Germany" className="bg-[#001248]">Germany</option>
              <option value="Other" className="bg-[#001248]">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={labelClasses}>Message <span className="text-cyan-400">*</span></label>
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleInputChange}
            className={`${inputClasses} resize-none`}
            placeholder="Tell us about your project..."
            maxLength={500}
            required
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-white/40 text-xs flex items-center gap-1">
            <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            24hr response
          </span>
          <button
            type="submit"
            disabled={!isFormValid() || submitting}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2
              ${!isFormValid() || submitting
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-[#000a2e] hover:bg-[#000520] text-white border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
