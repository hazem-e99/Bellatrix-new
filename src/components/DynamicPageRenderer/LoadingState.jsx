import { HomePageSkeleton } from "../Skeleton";

const LoadingState = ({ pageType = "home" }) => {
  // For homepage, show the full skeleton
  if (pageType === "home") {
    return <HomePageSkeleton />;
  }

  // For other pages, show a generic skeleton
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="skeleton w-36 h-10 rounded" />
            <div className="hidden md:flex items-center gap-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="skeleton w-20 h-5 rounded" />
              ))}
            </div>
            <div className="skeleton w-32 h-10 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Generic Page Content Skeleton */}
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="skeleton skeleton-title-lg w-96 max-w-full mb-8" />
        
        {/* Content blocks */}
        <div className="space-y-6">
          {[1, 2, 3].map((block) => (
            <div key={block} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <div className="skeleton skeleton-subtitle w-64 mb-4" />
              <div className="space-y-3">
                <div className="skeleton skeleton-paragraph w-full" />
                <div className="skeleton skeleton-paragraph w-full" />
                <div className="skeleton skeleton-paragraph w-5/6" />
                <div className="skeleton skeleton-paragraph w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;

