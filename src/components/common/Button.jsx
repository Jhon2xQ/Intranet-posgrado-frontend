import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-black dark:focus:ring-amber-300",
    secondary:
      "bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white dark:focus:ring-neutral-400",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400/10 dark:focus:ring-amber-300",
    ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-amber-400 dark:hover:bg-amber-400/10 dark:focus:ring-amber-300",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
