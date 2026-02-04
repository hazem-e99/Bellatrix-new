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
  return import.meta.env.VITE_API_BASE_URL || "https://68.178.169.236:5000";
};

/**
 * Get the base URL with /api suffix
 */
export const getApiBaseUrlWithApi = () => {
  if (import.meta.env.DEV) {
    return "/api"; // Use Vite proxy in development
  }
  return import.meta.env.VITE_API_BASE_URL_WITH_API || "https://68.178.169.236:5000/api";
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
