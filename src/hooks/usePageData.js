import { useState, useEffect } from "react";
import pagesAPI from "../lib/pagesAPI";
import { cachedFetch, invalidateCacheByPrefix } from "../lib/apiCache";

export const usePageData = (slug) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async (forceRefresh = false) => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const cacheKey = `page:${slug}`;

        // On forced refresh (after admin save) bust the cache entry
        if (forceRefresh) invalidateCacheByPrefix(cacheKey);

        const data = await cachedFetch(
          cacheKey,
          async () => {
            const response = await pagesAPI.getPublicPageBySlug(slug);
            return response.data || response;
          },
          // Cache public page data for 2 minutes
          120_000
        );

        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();

    const handlePageDataUpdate = (event) => {
      const { slug: updatedSlug } = event.detail;
      if (updatedSlug === slug) {
        // Force-refresh so we pick up the newly saved data
        fetchPage(true);
      }
    };

    window.addEventListener("pageDataUpdated", handlePageDataUpdate);

    return () => {
      window.removeEventListener("pageDataUpdated", handlePageDataUpdate);
    };
  }, [slug]);

  return { pageData, loading, error };
};
