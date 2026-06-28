import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-sans uppercase tracking-[0.12em] text-[0.82rem] transition-shadow duration-500 ease-lux select-none";

const sizes = {
  md: "px-9 py-4",
  sm: "px-6 py-3 text-[0.74rem]",
  lg: "px-10 py-5 text-[0.9rem]",
};

const variants = {
  primary:
    "bg-gradient-to-br from-blush-400 to-blush-600 text-white shadow-soft hover:shadow-lift",
  ghost:
    "bg-white/60 text-ink border border-blush-300/60 hover:bg-white hover:shadow-soft",
  olive:
    "bg-gradient-to-br from-olive to-olive-deep text-white shadow-soft hover:shadow-lift",
};

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const content = (
    <motion.span
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="contents"
    >
      {children}
    </motion.span>
  );

  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
