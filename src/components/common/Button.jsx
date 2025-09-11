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
      "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300",
    secondary:
      "bg-neutral-200 hover:bg-neutral-300 text-neutral-900 focus:ring-neutral-500",
    outline:
      "border border-yellow-400 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-300",
    ghost: "text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-300",
    danger:
      "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300",
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
