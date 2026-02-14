// Centralized API Configuration
// All API endpoints should use these base URLs

/**
 * Get the base URL for the API
 * In development, returns empty string to use Vite proxy
 * In production, returns the configured API URL
 */
export const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return ""; // Use Vite proxy in development
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin; // Match deployed origin to avoid CORS mismatches
  }
  return "https://bellatrixinc.com";
};

/**
 * Get the base URL with /api suffix
 */
export const getApiBaseUrlWithApi = () => {
  if (import.meta.env.DEV) {
    return "/api"; // Use Vite proxy in development
  }
  if (import.meta.env.VITE_API_BASE_URL_WITH_API) {
    return import.meta.env.VITE_API_BASE_URL_WITH_API;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return "https://bellatrixinc.com/api";
};

// Export constants for backward compatibility
export const API_BASE_URL = getApiBaseUrl();
export const API_BASE_URL_WITH_API = getApiBaseUrlWithApi();

export default {
  getApiBaseUrl,
  getApiBaseUrlWithApi,
  API_BASE_URL,
  API_BASE_URL_WITH_API,
};
