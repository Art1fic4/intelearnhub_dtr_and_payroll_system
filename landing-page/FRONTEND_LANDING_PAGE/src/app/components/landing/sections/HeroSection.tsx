import { motion } from "motion/react";
import { assets } from "@/app/constants/assets";

interface HeroSectionProps {
  shouldReduceMotion: boolean;
}

export default function HeroSection({ shouldReduceMotion }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="landing-section relative z-10 flex min-h-screen scroll-mt-28 items-center overflow-hidden bg-background/85 pt-24"
    >
      <div aria-hidden="true" className="hero-ambient">
        <div className="hero-ambient-gradient" />
        <div className="hero-ambient-wave" />
        <div className="hero-ambient-glow" />
        <div className="hero-ambient-orb hero-ambient-orb-gold" />
        <div className="hero-ambient-orb hero-ambient-orb-soft" />
        <div className="hero-ambient-grain" />
        <div className="hero-ambient-vignette" />
      </div>
      <div className="landing-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -40 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="landing-eyebrow"
            >
              <span className="text-sm font-semibold text-accent">
                Online institution for guided, flexible learning
              </span>
            </motion.div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Learn with confidence,
              <span className="block text-accent">from anywhere</span>
            </h1>

            <p className="landing-subheading mb-8 max-w-xl">
              Intelearn Hub is an online educational institution where students enroll in quality online classes, learn
              from expert faculty, and build career-ready skills.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                type="button"
                className="landing-primary-btn px-8 py-4 text-lg shadow-lg"
                aria-describedby="enroll-note"
              >
                Enroll Now
              </motion.button>
            </div>
            <p id="enroll-note" className="mt-3 text-xs font-medium text-muted-foreground">
              Admissions opens soon.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 40 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <motion.img
              src={assets.heroLiveClassGraphic}
              alt="Intelearn Hub hero illustration for online learning"
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-full max-w-[46rem] object-contain"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
