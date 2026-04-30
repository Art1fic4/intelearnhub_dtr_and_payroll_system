import { Menu } from "lucide-react";

interface PortalHeaderProps {
  title: string;
  subtitle: string;
  avatar: string;
  name: string;
  meta: string;
  onProfileClick: () => void;
  onMobileMenuToggle: () => void;
}

export default function PortalHeader({
  title,
  subtitle,
  avatar,
  name,
  meta,
  onProfileClick,
  onMobileMenuToggle,
}: PortalHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 border-b border-border/80 bg-background/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:left-[var(--sidebar-width)] lg:px-8 lg:transition-[left] lg:duration-300 lg:ease-in-out">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="inline-flex rounded-lg border border-border/80 bg-card/80 p-2 text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/80 px-3 py-2 transition-colors duration-300 hover:bg-secondary sm:px-4"
        >
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full border-2 border-accent object-cover" />
          <div className="text-left">
            <div className="font-semibold text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{meta}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
