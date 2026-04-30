import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import footerLogo from "@/assets/LEARNHUB-GOLD(1).svg";

export default function FooterSection() {
  return (
    <footer id="contact" className="relative z-10 scroll-mt-28 border-t border-border/80 bg-muted/55 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_12px_30px_rgba(31,28,20,0.08)] sm:p-5 lg:p-6">
          <div className="flex flex-col items-center text-center">
            <img src={footerLogo} alt="Intelearn Hub" className="h-10 w-auto rounded-lg bg-transparent p-1" />
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Intelearn Hub is an online educational institution committed to accessible, high-quality learning and
              student-centered outcomes.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {[
              { label: "Facebook", icon: Facebook },
              { label: "Instagram", icon: Instagram },
              { label: "Twitter", icon: Twitter },
              { label: "YouTube", icon: Youtube },
              { label: "LinkedIn", icon: Linkedin },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href="#"
                  aria-label={item.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-accent transition-colors duration-300 hover:border-accent hover:bg-secondary hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 text-center md:grid-cols-2 md:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Explore</p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { label: "Home", href: "#home" },
                  { label: "Subjects", href: "#subjects" },
                  { label: "Testimonials", href: "#testimonials" },
                  { label: "Login", href: "/login" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-xs text-muted-foreground transition-colors duration-300 hover:text-accent sm:text-sm"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Contact</p>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground sm:text-sm">
                <p>Online Support: Mon - Fri</p>
                <p>Email: admissions@intelearnhub.edu</p>
                <p>Program Advising Available</p>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-3">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
              <p>© 2026 Intelearn Hub - Online Educational Institution.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
