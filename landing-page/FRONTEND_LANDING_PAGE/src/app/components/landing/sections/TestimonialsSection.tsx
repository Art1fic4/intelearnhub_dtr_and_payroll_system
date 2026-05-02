import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image: string;
}

interface TestimonialsSectionProps {
  shouldReduceMotion: boolean;
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({ shouldReduceMotion, testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion || isPaused) {
      return;
    }

    const autoplay = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(autoplay);
  }, [isPaused, shouldReduceMotion, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    const threshold = 45;
    if (delta > threshold) goToPrevious();
    if (delta < -threshold) goToNext();
    setTouchStartX(null);
  };

  return (
    <section
      id="testimonials"
      className="landing-section relative z-10 scroll-mt-28 bg-background/92 backdrop-blur-[1px]"
    >
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-8 h-px w-16 bg-accent" />
          <h2 className="landing-heading mb-4">Student Testimonials</h2>
          <p className="landing-subheading">Hear from learners who studied with Intelearn Hub</p>
        </motion.div>

        <div
          ref={carouselRef}
          className="glass-panel mx-auto max-w-3xl rounded-3xl p-4 sm:p-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goToPrevious();
            if (event.key === "ArrowRight") goToNext();
          }}
          tabIndex={0}
          role="region"
          aria-label="Student testimonials carousel"
        >
          <div className="relative min-h-[330px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[currentIndex].name}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 18 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="landing-card bg-card p-8 sm:p-9"
                aria-live="polite"
              >
                <Quote className="mb-6 h-10 w-10 text-accent" />
                <p className="mb-8 min-h-[88px] text-base leading-relaxed text-muted-foreground italic line-clamp-4">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="mb-6 inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Verified learner outcome
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Show previous testimonial"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Show next testimonial"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={currentIndex === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "w-7 bg-accent" : "w-2.5 bg-border hover:bg-accent/60"
                }`}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-300 hover:border-accent hover:text-accent"
              aria-label={isPaused ? "Resume testimonial autoplay" : "Pause testimonial autoplay"}
              aria-pressed={isPaused}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {isPaused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
