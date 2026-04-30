import { LandingNavbar } from "@/features/landing/components";
import UnifiedLogin from "@/app/pages/UnifiedLogin";

export default function LoginPageWithNavbar() {
  return (
    <div className="landing-shell relative overflow-hidden">
      <div aria-hidden="true" className="site-ambient">
        <div className="site-ambient-gradient" />
        <div className="site-ambient-orb site-ambient-orb-gold" />
        <div className="site-ambient-orb site-ambient-orb-soft" />
        <div className="site-ambient-grain" />
      </div>
      <LandingNavbar />
      <section id="login-interface" className="relative z-10 min-h-screen bg-background/80 pt-28 pb-10">
        <div className="landing-container">
          <UnifiedLogin embedded />
        </div>
      </section>
    </div>
  );
}
