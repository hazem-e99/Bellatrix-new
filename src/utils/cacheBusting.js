/**
 * Add cache-busting parameter to image/media URLs
 * Ensures browser fetches fresh content when media is updated in admin panel
 */

/**
 * Add a timestamp query parameter to force browser to refetch the resource
 * @param {string} url - The original URL
 * @param {string|number} version - Optional version/timestamp (defaults to current timestamp)
 * @returns {string} - URL with cache-busting parameter
 */
export const addCacheBuster = (url, version = null) => {
  if (!url) return url;
  
  // Don't add cache buster to external URLs or data URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Use provided version or current timestamp
  const bust = version || Date.now();
  
  // Check if URL already has query params
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}v=${bust}`;
};

/**
 * Get cache-busting version from localStorage or generate new one
 * This ensures all images on a page use the same version parameter
 * Call updateMediaVersion() after successful media upload to invalidate cache
 */
export const getMediaVersion = () => {
  const version = localStorage.getItem('mediaVersion');
  if (version) return version;
  
  const newVersion = Date.now();
  localStorage.setItem('mediaVersion', newVersion);
  return newVersion;
};

/**
 * Update the media version to invalidate all cached images
 * Call this after successfully uploading/updating media
 */
export const updateMediaVersion = () => {
  const newVersion = Date.now();
  localStorage.setItem('mediaVersion', newVersion);
  return newVersion;
};

/**
 * Add cache-busting using the global media version
 * All images will share the same version, updated when media changes
 * @param {string} url - The image URL
 * @param {string|number} customVersion - Optional: use component's updatedAt or custom version
 */
export const addMediaVersionToBust = (url, customVersion = null) => {
  if (!url) return url;
  // Use custom version (like component updatedAt) if provided, otherwise use global mediaVersion
  const version = customVersion || getMediaVersion();
  return addCacheBuster(url, version);
};
