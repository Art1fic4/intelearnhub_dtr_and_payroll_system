import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";

const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const LoginPageWithNavbar = lazy(() => import("@/features/auth/pages/LoginPageWithNavbar"));
const FacultyPortal = lazy(() => import("@/features/portal/faculty/pages/FacultyPortal"));
const StudentPortal = lazy(() => import("@/features/portal/student/pages/StudentPortal"));

const withSuspense = (component: ReactNode) => (
  <Suspense fallback={<div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>}>
    {component}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<LandingPage />),
  },
  {
    path: "/login",
    element: withSuspense(<LoginPageWithNavbar />),
  },
  {
    path: "/faculty/dashboard",
    element: withSuspense(<FacultyPortal />),
  },
  {
    path: "/student/login",
    element: withSuspense(<LoginPageWithNavbar />),
  },
  {
    path: "/faculty/login",
    element: withSuspense(<LoginPageWithNavbar />),
  },
  {
    path: "/student/dashboard",
    element: withSuspense(<StudentPortal />),
  },
]);
