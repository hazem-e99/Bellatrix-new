import { cachedFetch } from "../lib/apiCache";

const TEN_MINUTES = 10 * 60 * 1000;

/**
 * Shared cached loader for /data/Implementation.json.
 * All Implementation page components call this instead of fetching individually,
 * so only one network request fires regardless of how many components mount.
 */
export function loadImplementationData() {
  return cachedFetch(
    "public:data:Implementation.json",
    () => fetch("/data/Implementation.json").then((r) => r.json()),
    TEN_MINUTES
  );
}
