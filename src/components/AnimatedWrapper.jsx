import { motion } from 'framer-motion';

/**
 * AnimatedWrapper
 * A simple wrapper component that applies a fade‑in + slide‑up animation when the component
 * enters the viewport. It forwards any received props to the underlying <motion.div>.
 */
export default function AnimatedWrapper({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
