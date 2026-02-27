import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({ children, delay = 0, hover = true, className, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={hover ? {
        y: -4,
        transition: { duration: 0.2 },
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
}

export function AnimatedButton({ children, className, ...props }: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedListProps {
  children: ReactNode[];
  stagger?: number;
}

export function AnimatedList({ children, stagger = 0.05 }: AnimatedListProps) {
  return (
    <>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * stagger,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
