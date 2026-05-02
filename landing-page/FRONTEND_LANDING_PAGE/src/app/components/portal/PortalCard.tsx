import type { ReactNode } from "react";

export const portalCardClass = "rounded-xl border border-border bg-card p-8 shadow-lg";

interface PortalCardProps {
  children: ReactNode;
  className?: string;
}

export default function PortalCard({ children, className = "" }: PortalCardProps) {
  return <div className={`${portalCardClass} ${className}`.trim()}>{children}</div>;
}
