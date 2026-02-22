import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { CTAModalProvider } from "./contexts/CTAModalContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { toastConfig } from "./config/toast";

/**
 * Wraps React.lazy() with automatic reload on ChunkLoadError.
 * After a new deployment, old chunk filenames no longer exist on the server.
 * The browser receives the SPA's index.html instead → MIME type error.
 * Forcing a reload fetches the fresh index.html with the correct chunk URLs.
 */
const lazyWithRetry = (factory) =>
  lazy(() =>
    factory().catch((err) => {
      const isChunkError =
        err?.name === "ChunkLoadError" ||
        /Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
          err?.message || ""
        );
      if (isChunkError) {
        window.location.reload();
        // Return a never-resolving promise so React doesn't render anything mid-reload
        return new Promise(() => {});
      }
      throw err;
    })
  );

// --- Lazy-loaded public pages ---
const MainServices      = lazyWithRetry(() => import("./components/Services/MainServices"));
const Support           = lazyWithRetry(() => import("./components/Support/Support"));
const SolutionMain      = lazyWithRetry(() => import("./components/solution/SolutionMain"));
const Manufacturing     = lazyWithRetry(() => import("./pages/Industries/Manufacturing"));
const Retail            = lazyWithRetry(() => import("./pages/Industries/Retail"));
const PayrollPage       = lazyWithRetry(() => import("./pages/Payroll"));
const DynamicPageRenderer = lazyWithRetry(() => import("./components/DynamicPageRenderer/index"));
const AuthRoutes        = lazyWithRetry(() => import("./routes/AuthRoutes"));

// --- Lazy-loaded admin pages ---
const ModernAdminLayout   = lazyWithRetry(() => import("./components/Admin/ModernAdminLayout"));
const AdminLayout         = lazyWithRetry(() => import("./components/Admin/AdminLayout"));
const ModernDashboard     = lazyWithRetry(() => import("./components/Admin/ModernDashboard"));
const AuthDashboard       = lazyWithRetry(() => import("./components/Admin/AuthDashboard"));
const AdminDashboard      = lazyWithRetry(() => import("./components/Admin/AdminDashboard"));
const PagesManagement     = lazyWithRetry(() => import("./components/Admin/PagesManagement/index"));
const CategoriesManagement = lazyWithRetry(() => import("./components/Admin/CategoriesManagement"));
const EnhancedPageBuilder  = lazyWithRetry(() => import("./components/Admin/EnhancedPageBuilder"));
const TemplatesManagement  = lazyWithRetry(() => import("./components/Admin/TemplatesManagement"));
const SettingsManagement   = lazyWithRetry(() => import("./components/Admin/SettingsManagement"));
const MessagesPage         = lazyWithRetry(() => import("./pages/Admin/MessagesPage"));
const ComponentsShowcase   = lazyWithRetry(() => import("./pages/Admin/ComponentsShowcase"));
const ChangePassword       = lazyWithRetry(() => import("./pages/auth/ChangePassword"));

// Full-page loading fallback
const PageFallback = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
    <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTopColor: "#C41E3A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CTAModalProvider>
          <Toaster {...toastConfig} />
          <Suspense fallback={<PageFallback />}>
            <Routes>
            {/* Authentication Routes */}
            <Route path="/auth/*" element={<AuthRoutes />} />

            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="ImplementationStatic" element={<MainServices />} />
              <Route path="TrainingStatic" element={<MainServices />} />
              <Route path="netsuite-consulting" element={<MainServices />} />
              <Route path="customization" element={<MainServices />} />
              <Route path="integration" element={<MainServices />} />
              {/* Support static routes (both cases) */}
              <Route path="SupportStatic" element={<Support />} />
              <Route path="supportStatic" element={<Support />} />
              <Route path="hrStatic" element={<SolutionMain />} />
              {/* <Route path="Payroll" element={<SolutionMain />} /> */}
              <Route path="/PayrollStatic" element={<PayrollPage />} />
              <Route
                path="/industries/manufacturingStatic"
                element={<Manufacturing />}
              />
              <Route path="/industries/retail" element={<Retail />} />

              {/* Dynamic Page Routes - This should be last to catch all dynamic pages */}
              <Route path="/:slug" element={<DynamicPageRenderer />} />

              {/* 
            <Route path="Support" element={<Support />} />
            <Route path="industries/manufacturing" element={<IndustryMain />} />
            <Route path="industries/retail" element={<IndustryMain />} />
            Add more industry routes as needed, all handled by IndustryMain 
            */}
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <ModernAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ModernDashboard />} />
              <Route path="dashboard" element={<ModernDashboard />} />
              <Route path="auth-dashboard" element={<AuthDashboard />} />
              <Route path="pages" element={<PagesManagement />} />
              <Route path="pages/:pageId" element={<PagesManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route
                path="pages/enhanced-create"
                element={<EnhancedPageBuilder />}
              />
              <Route path="templates" element={<TemplatesManagement />} />
              <Route
                path="templates/:templateId"
                element={<TemplatesManagement />}
              />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="components-showcase"
                element={<ComponentsShowcase />}
              />
            </Route>

            {/* Legacy Admin Routes (keep for compatibility) - Also Protected */}
            <Route
              path="/admin-legacy/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="pages" element={<AdminDashboard />} />
              <Route path="pages/:pageId" element={<AdminDashboard />} />
              <Route path="templates" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
            </Route>
          </Routes>
          </Suspense>
        </CTAModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
