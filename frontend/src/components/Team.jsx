import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const team = [
  { name: 'Anjum Rouf', role: 'FACULTY', initials: 'AR', color: 'from-primary to-primary-container' },
  { name: 'Mohd. Faisal', role: 'STUDENT', initials: 'MF', color: 'from-secondary to-secondary-container' },
  { name: 'Anuja Sharma', role: 'STUDENT', initials: 'AS', color: 'from-primary to-secondary' },
  { name: 'Muli Sahithi Reddy', role: 'STUDENT', initials: 'MS', color: 'from-tertiary to-secondary' },
  { name: 'Anurag Singh Yadav', role: 'STUDENT', initials: 'AY', color: 'from-primary to-tertiary' },
  { name: 'Rahul Mishra', role: 'STUDENT', initials: 'RM', color: 'from-secondary to-primary' },
  { name: 'Sneha Pandey', role: 'STUDENT', initials: 'SP', color: 'from-primary-container to-secondary-container' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Team() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="team" className="py-28 bg-surface-container-low" ref={ref}>
      <div className="container mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">The Research Team</h2>
          <p className="section-subtitle">
            Led by a faculty mentor and driven by passionate students, this project explores <br />
            AI-powered ocean intelligence using data science and modern technologies.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 max-w-5xl mx-auto"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={item}
              className="text-center group"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Avatar */}
                <div
                  className={`relative w-full h-full rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-on-primary font-bold text-lg font-headline border-2 border-transparent group-hover:border-primary/50 transition-all duration-300`}
                >
                  {member.initials}
                </div>
              </div>
              <h4 className="font-bold text-sm text-on-surface leading-tight">{member.name}</h4>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
