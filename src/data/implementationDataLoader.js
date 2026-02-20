/**
 * Shared loader for /data/Implementation.json.
 * All Implementation sub-components (Hero, Process, Pricing, WhyChoose, Modal)
 * call this function. The result is cached in memory for the lifetime of the
 * page so only ONE network request fires no matter how many components mount.
 */
import { cachedFetch } from "../lib/apiCache";

const IMPLEMENTATION_CACHE_KEY = "public:data:Implementation.json";
const TTL = 10 * 60 * 1000; // 10 minutes

export const loadImplementationData = () =>
  cachedFetch(
    IMPLEMENTATION_CACHE_KEY,
    async () => {
      const res = await fetch("/data/Implementation.json");
      if (!res.ok) throw new Error(`Failed to load Implementation.json: ${res.status}`);
      return res.json();
    },
    TTL
  );
