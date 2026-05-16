import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, type: "spring", stiffness: 200, damping: 25 },
  }),
};

export default function AnimatedCard({ children, className = "", index = 0, gradient = false }) {
  const cardClass = `card ${gradient ? "card-gradient" : ""} ${className}`.trim();

  return (
    <motion.div
      className={cardClass}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}
