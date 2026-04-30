import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PortalNavItem {
  icon: LucideIcon;
  label: string;
  view: string;
}

interface PortalSidebarProps {
  title: string;
  navItems: PortalNavItem[];
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function PortalSidebar({
  title,
  navItems,
  activeView,
  onViewChange,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: PortalSidebarProps) {
  const sidebarWidthClass = isCollapsed ? "lg:w-24" : "lg:w-80";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-[18.5rem] flex-col border-r border-sidebar-border/80 bg-sidebar/95 text-sidebar-foreground backdrop-blur transition-[width,transform] duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarWidthClass} lg:translate-x-0 lg:shadow-[14px_0_38px_rgba(0,0,0,0.26)]`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -top-24 left-4 h-48 w-48 rounded-full bg-sidebar-primary/20 blur-3xl" />
          <div className="absolute bottom-10 -right-20 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="relative border-b border-sidebar-border/80 p-4 lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-h-10">
              {isCollapsed ? (
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sidebar-border/80 bg-sidebar-accent/70 text-sm font-bold tracking-wide text-secondary">
                  IH
                </div>
              ) : (
                <>
                  <p className="text-xl font-semibold tracking-wide text-white">Intelearn Hub</p>
                  <p className="text-xs text-secondary/90">{title}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleCollapse}
                className="hidden rounded-lg border border-sidebar-border/80 bg-sidebar-accent/70 p-1.5 text-secondary transition-colors hover:bg-sidebar-accent lg:inline-flex"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button
                onClick={onMobileClose}
                className="inline-flex rounded-lg border border-sidebar-border/80 bg-sidebar-accent/70 p-1.5 text-secondary transition-colors hover:bg-sidebar-accent lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <nav className="relative flex-1 overflow-y-auto p-3 lg:p-4">
          {!isCollapsed && (
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/80">
              Navigation
            </p>
          )}
          <div className={`grid gap-2 ${isCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-1"} grid-cols-1`}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onViewChange(item.view);
                  onMobileClose();
                }}
                className={`group flex w-full items-center rounded-xl border py-3 transition-all duration-300 ${
                  isCollapsed ? "justify-center px-2" : "px-4"
                } ${
                  activeView === item.view
                    ? "border-sidebar-primary/60 bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-[0_10px_24px_rgba(212,175,55,0.32)]"
                    : "border-transparent bg-sidebar-accent/40 text-secondary hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                aria-label={item.label}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform duration-300 ${
                    activeView === item.view ? "" : "group-hover:translate-x-0.5"
                  }`}
                />
                {!isCollapsed && <span className="ml-3 text-left">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="relative border-t border-sidebar-border/80 p-3 lg:p-4">
          <button
            onClick={onLogout}
            className={`flex w-full items-center rounded-xl border border-transparent bg-sidebar-accent/40 py-3 text-secondary transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-4"
            }`}
            aria-label="Logout"
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
