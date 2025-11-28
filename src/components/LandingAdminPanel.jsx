import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import thunks
import { login, uploadImage, getProfile } from "../store/auth/authSlice";
import {
  fetchHero,
  createHero,
  updateHero,
  deleteHero,
} from "../store/hero/heroSlice";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../store/landing/servicesSlice";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../store/landing/testimonialsSlice";
import {
  fetchIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "../store/landing/industriesSlice";
import {
  modal,
  cta,
  pricing,
  process,
  whyChoose,
} from "../store/content/contentSlice";

// Import selectors
import {
  selectIsAnyLoading,
  selectAllErrors,
  selectIsAuthenticated,
  selectCurrentUser,
  selectStaleResources,
} from "../store/globalSelectors";

import { selectHeroItem, selectIsHeroStale } from "../store/hero/heroSlice";

import {
  selectServicesItems,
  selectIsServicesStale,
} from "../store/landing/servicesSlice";

import {
  selectTestimonialsItems,
  selectIsTestimonialsStale,
} from "../store/landing/testimonialsSlice";

import {
  selectIndustriesItems,
  selectIsIndustriesStale,
} from "../store/landing/industriesSlice";

const LandingAdminPanel = () => {
  const dispatch = useDispatch();

  // Global state
  const isAnyLoading = useSelector(selectIsAnyLoading);
  const allErrors = useSelector(selectAllErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const staleResources = useSelector(selectStaleResources);

  // Resource-specific state
  const heroItem = useSelector(selectHeroItem);
  const isHeroStale = useSelector(selectIsHeroStale);

  const servicesItems = useSelector(selectServicesItems);
  const isServicesStale = useSelector(selectIsServicesStale);

  const testimonialsItems = useSelector(selectTestimonialsItems);
  const isTestimonialsStale = useSelector(selectIsTestimonialsStale);

  const industriesItems = useSelector(selectIndustriesItems);
  const isIndustriesStale = useSelector(selectIsIndustriesStale);

  // Component state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);

  // Fetch stale data on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    // Only fetch data that is stale or never fetched
    if (isHeroStale || !heroItem) {
      dispatch(fetchHero());
    }

    if (isServicesStale || servicesItems.length === 0) {
      dispatch(fetchServices());
    }

    if (isTestimonialsStale || testimonialsItems.length === 0) {
      dispatch(fetchTestimonials());
    }

    if (isIndustriesStale || industriesItems.length === 0) {
      dispatch(fetchIndustries());
    }

    // Fetch content sections if stale
    if (staleResources.includes("content_modal")) {
      dispatch(modal.fetch());
    }
    if (staleResources.includes("content_cta")) {
      dispatch(cta.fetch());
    }
    if (staleResources.includes("content_pricing")) {
      dispatch(pricing.fetch());
    }
    if (staleResources.includes("content_process")) {
      dispatch(process.fetch());
    }
    if (staleResources.includes("content_whyChoose")) {
      dispatch(whyChoose.fetch());
    }
  }, [
    dispatch,
    isAuthenticated,
    isHeroStale,
    isServicesStale,
    isTestimonialsStale,
    isIndustriesStale,
    staleResources,
    heroItem,
    servicesItems.length,
    testimonialsItems.length,
    industriesItems.length,
  ]);

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ payload: loginForm })).then((result) => {
      if (result.type.endsWith("/fulfilled")) {
        setShowLoginForm(false);
        dispatch(getProfile());
      }
    });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      dispatch(uploadImage({ payload: { image: selectedFile } }));
      setSelectedFile(null);
    }
  };

  const handleRetry = (resourceName) => {
    switch (resourceName) {
      case "hero":
        dispatch(fetchHero({ force: true }));
        break;
      case "services":
        dispatch(fetchServices({ force: true }));
        break;
      case "testimonials":
        dispatch(fetchTestimonials({ force: true }));
        break;
      case "industries":
        dispatch(fetchIndustries({ force: true }));
        break;
      case "content_modal":
        dispatch(modal.fetch({ force: true }));
        break;
      case "content_cta":
        dispatch(cta.fetch({ force: true }));
        break;
      case "content_pricing":
        dispatch(pricing.fetch({ force: true }));
        break;
      case "content_process":
        dispatch(process.fetch({ force: true }));
        break;
      case "content_whyChoose":
        dispatch(whyChoose.fetch({ force: true }));
        break;
      default:
        console.warn("Unknown resource for retry:", resourceName);
    }
  };

  const ErrorDisplay = ({ resourceName, error }) => (
    <div className="text-red-600 my-2 p-2 border border-red-600 rounded">
      <strong>{resourceName} Error:</strong> {error}
      <button
        onClick={() => handleRetry(resourceName)}
        className="ml-2 px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
      >
        Retry
      </button>
    </div>
  );

  if (showLoginForm && !isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAnyLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnyLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {allErrors.auth && (
          <ErrorDisplay resourceName="auth" error={allErrors.auth} />
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Landing Page Admin Panel</h1>
        <div>
          {currentUser && (
            <span className="text-gray-700">Welcome, {currentUser.email || currentUser.username}</span>
          )}
          {isAnyLoading && (
            <div className="text-blue-600 ml-4 inline-block">Loading...</div>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      {isAuthenticated && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">File Upload</h3>
          <form onSubmit={handleFileUpload} className="flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mr-2"
            />
            <button 
              type="submit" 
              disabled={!selectedFile || isAnyLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Upload Image
            </button>
          </form>
          {allErrors.auth && allErrors.auth.includes("upload") && (
            <ErrorDisplay resourceName="upload" error={allErrors.auth} />
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Hero Section</h2>
        {allErrors.hero && (
          <ErrorDisplay resourceName="hero" error={allErrors.hero} />
        )}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold mb-2">Current Hero Data:</h4>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60 text-sm">
            {JSON.stringify(heroItem, null, 2)}
          </pre>
          <div className="mt-3 space-x-2">
            <button
              onClick={() =>
                dispatch(createHero({ payload: { title: "New Hero" } }))
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Hero
            </button>
            <button
              onClick={() =>
                dispatch(updateHero({ payload: { title: "Updated Hero" } }))
              }
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update Hero
            </button>
            <button
              onClick={() => dispatch(deleteHero())}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Hero
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Services ({servicesItems.length})</h2>
        {allErrors.services && (
          <ErrorDisplay resourceName="services" error={allErrors.services} />
        )}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold mb-2">Services List:</h4>
          <div className="max-h-52 overflow-auto bg-gray-100 p-3 rounded">
            {servicesItems.map((service, index) => (
              <div
                key={service.id || index}
                className="mb-2 p-2 bg-white rounded shadow-sm"
              >
                <strong className="block">
                  {service.name || service.title || `Service ${index + 1}`}
                </strong>
                <div className="text-sm text-gray-600">
                  {service.description || service.subtitle || "No description"}
                </div>
              </div>
            ))}
            {servicesItems.length === 0 && <div className="text-gray-500">No services found</div>}
          </div>
          <div className="mt-3">
            <button
              onClick={() =>
                dispatch(createService({ payload: { name: "New Service" } }))
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Service
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Testimonials ({testimonialsItems.length})</h2>
        {allErrors.testimonials && (
          <ErrorDisplay
            resourceName="testimonials"
            error={allErrors.testimonials}
          />
        )}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold mb-2">Testimonials List:</h4>
          <div className="max-h-52 overflow-auto bg-gray-100 p-3 rounded">
            {testimonialsItems.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="mb-2 p-2 bg-white rounded shadow-sm"
              >
                <strong className="block">
                  {testimonial.author ||
                    testimonial.name ||
                    `Testimonial ${index + 1}`}
                </strong>
                <div className="text-sm text-gray-600">
                  {testimonial.content || testimonial.text || "No content"}
                </div>
              </div>
            ))}
            {testimonialsItems.length === 0 && <div className="text-gray-500">No testimonials found</div>}
          </div>
          <div className="mt-3">
            <button
              onClick={() =>
                dispatch(
                  createTestimonial({
                    payload: {
                      author: "New Client",
                      content: "Great service!",
                    },
                  })
                )
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Testimonial
            </button>
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Industries ({industriesItems.length})</h2>
        {allErrors.industries && (
          <ErrorDisplay
            resourceName="industries"
            error={allErrors.industries}
          />
        )}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold mb-2">Industries List:</h4>
          <div className="max-h-52 overflow-auto bg-gray-100 p-3 rounded">
            {industriesItems.map((industry, index) => (
              <div
                key={industry.id || index}
                className="mb-2 p-2 bg-white rounded shadow-sm"
              >
                <strong className="block">
                  {industry.name || industry.title || `Industry ${index + 1}`}
                </strong>
                <div className="text-sm text-gray-600">
                  {industry.description || "No description"}
                </div>
              </div>
            ))}
            {industriesItems.length === 0 && <div className="text-gray-500">No industries found</div>}
          </div>
          <div className="mt-3">
            <button
              onClick={() =>
                dispatch(createIndustry({ payload: { name: "New Industry" } }))
              }
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Industry
            </button>
          </div>
        </div>
      </div>

      {/* Stale Resources Warning */}
      {staleResources.length > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Stale Data Detected</h3>
          <p className="text-yellow-700">The following resources have stale data:</p>
          <ul className="list-disc list-inside mt-2">
            {staleResources.map((resource) => (
              <li key={resource} className="text-yellow-800">
                {resource}
                <button
                  onClick={() => handleRetry(resource)}
                  className="ml-2 px-2 py-0.5 bg-yellow-200 hover:bg-yellow-300 rounded text-xs text-yellow-900"
                >
                  Refresh
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Global Actions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Global Actions</h3>
        <button
          onClick={() => {
            dispatch(fetchHero({ force: true }));
            dispatch(fetchServices({ force: true }));
            dispatch(fetchTestimonials({ force: true }));
            dispatch(fetchIndustries({ force: true }));
          }}
          disabled={isAnyLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Refresh All Data
        </button>
        <button
          onClick={() => setShowLoginForm(true)}
          className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Show Login
        </button>
      </div>
    </div>
  );
};

export default LandingAdminPanel;
