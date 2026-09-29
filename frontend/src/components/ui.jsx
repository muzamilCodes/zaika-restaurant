import { cloneElement } from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils.js';

export function Button({ asChild = false, className = '', children, ...props }) {
  const classes =
    'inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/60 active:scale-[0.98] sm:px-5 sm:py-3';

  if (asChild) {
    if (children && typeof children === 'object') {
      return cloneElement(children, {
        ...props,
        className: cn(classes, className, children.props.className)
      });
    }
  }

  return (
    <button className={cn(classes, className)} {...props}>
      {children}
    </button>
  );
}



export function GlassCard({ className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-xl sm:rounded-3xl sm:p-6',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-gold sm:mb-3 sm:text-xs sm:tracking-[0.35em]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-white/70 sm:mt-4 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}
