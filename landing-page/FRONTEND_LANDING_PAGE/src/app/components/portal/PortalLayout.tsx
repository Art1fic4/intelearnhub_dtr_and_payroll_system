import type { ReactNode } from "react";

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-[18%] opacity-70 [background:radial-gradient(circle_at_14%_20%,rgba(212,175,55,0.16),transparent_45%),radial-gradient(circle_at_86%_20%,rgba(11,11,11,0.08),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(176,141,24,0.12),transparent_56%)]" />
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col lg:flex-row">{children}</div>
    </div>
  );
}
