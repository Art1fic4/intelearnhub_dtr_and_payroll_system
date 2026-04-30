import { motion } from "motion/react";

interface TrustSectionProps {
  shouldReduceMotion: boolean;
}

export default function TrustSection({ shouldReduceMotion }: TrustSectionProps) {
  return (
    <section id="trust" className="landing-section relative z-10 scroll-mt-28 bg-background/90 backdrop-blur-[1px]">
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-8 h-px w-16 bg-accent" />
          <h2 className="landing-heading mb-4">Why Learners Trust Intelearn Hub</h2>
          <p className="landing-subheading mx-auto max-w-3xl">
            Built on academic quality, supportive faculty, and flexible online learning for every enrolled student.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Expert-led instruction",
              text: "Experienced educators guide each online class from core concepts to advanced application.",
            },
            {
              title: "Career-ready learning",
              text: "Programs combine theory and practical work so students graduate ready for real opportunities.",
            },
            {
              title: "Flexible online classes",
              text: "Students learn through accessible online sessions designed to fit modern schedules.",
            },
          ].map((item) => (
            <div key={item.title} className="landing-card landing-card-hover">
              <div className="mb-3 flex items-center gap-2">
                {item.icon}
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
