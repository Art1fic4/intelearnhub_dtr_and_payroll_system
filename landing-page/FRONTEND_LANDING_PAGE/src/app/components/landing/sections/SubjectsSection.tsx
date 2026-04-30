import { motion } from "motion/react";

export interface CourseItem {
  code: string;
  name: string;
  description: string;
}

interface SubjectsSectionProps {
  shouldReduceMotion: boolean;
  courses: CourseItem[];
}

export default function SubjectsSection({ shouldReduceMotion, courses }: SubjectsSectionProps) {
  return (
    <section id="subjects" className="landing-section relative z-10 scroll-mt-28 bg-secondary/35 backdrop-blur-[1px]">
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-8 h-px w-16 bg-accent" />
          <h2 className="landing-heading mb-4">Subjects Offered</h2>
          <p className="landing-subheading">Explore our core academic offerings for online learners</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.div
              key={course.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(31, 28, 20, 0.12)" }}
              className="landing-card landing-card-hover group relative p-8"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7a5a14]/0 via-[#7a5a14]/0 to-[#7a5a14]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 font-mono text-sm font-semibold tracking-wider text-accent">{course.code}</div>
                <h3 className="mb-3 text-2xl font-bold text-foreground">{course.name}</h3>
                <p className="leading-relaxed text-muted-foreground">{course.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
