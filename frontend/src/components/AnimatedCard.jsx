import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, type: "spring", stiffness: 200, damping: 25 },
  }),
};

export default function AnimatedCard({ children, className = "", index = 0, gradient = false }) {
  // If gradient=true, use the dark stone variation from the reference design
  const cardClass = `card-stone p-6 flex flex-col ${gradient ? "bg-stone-900 text-stone-50" : ""} ${className}`.trim();

  return (
    <motion.div
      className={cardClass}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ scale: 0.98, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  );
}
