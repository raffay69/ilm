import { motion } from "framer-motion";
import { ReactNode } from "react";

type FadeInProps = {
    children: ReactNode;
  };

const FadeIn = ({ children }:FadeInProps) => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.4 }}
  >
    {children}
  </motion.div>
  );
};

export default FadeIn;
