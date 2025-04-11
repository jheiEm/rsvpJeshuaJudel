import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Lazy load admin pages to improve initial load performance
const AdminLoginPage = lazy(() => import("@/pages/admin/login"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const AdminRsvpsPage = lazy(() => import("@/pages/admin/rsvps"));
const AdminGuestMessagesPage = lazy(() => import("@/pages/admin/guest-messages"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fff5f7]">
    <div className="animate-pulse text-2xl text-[#6b0f2b] font-['Great_Vibes']">
      Loading...
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login">
        <Suspense fallback={<LoadingFallback />}>
          <AdminLoginPage />
        </Suspense>
      </Route>
      <Route path="/admin/dashboard">
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboardPage />
        </Suspense>
      </Route>
      <Route path="/admin/rsvps">
        <Suspense fallback={<LoadingFallback />}>
          <AdminRsvpsPage />
        </Suspense>
      </Route>
      <Route path="/admin/guest-messages">
        <Suspense fallback={<LoadingFallback />}>
          <AdminGuestMessagesPage />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
